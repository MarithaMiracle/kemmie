import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Zap, Gift, Settings, Camera } from 'lucide-react-native';
import { ShareVibeModal } from './share-vibe-modal';

import { getToken, fetchVibeCheckSummary, recordVibeCheck, fetchHomeSummary } from '../lib/api';
const themeGradientMap: Record<string, string[]> = {
  'pink-purple': ['#0F172A', '#111827'],
  'blue-purple': ['#111827', '#1F2937'],
  'pink-orange': ['#0F172A', '#1F2937'],
  'green-blue': ['#064E3B', '#0F172A'],
  'red-pink': ['#3F0D12', '#111827'],
  'purple-indigo': ['#1E1B4B', '#0F172A'],
};

interface HomeScreenProps {
  darkMode: boolean;
  selectedTheme: string;
  onOpenSettings: () => void;
  onOpenVibes?: () => void;
  currentUserName: string;
  bestieName: string;
}

export function HomeScreen({ darkMode, selectedTheme, onOpenSettings, onOpenVibes, currentUserName, bestieName }: HomeScreenProps) {
  const [showShareVibe, setShowShareVibe] = useState(false);

  const [todayCheckins, setTodayCheckins] = useState<any[]>([
    { author: bestieName, mood: 'Chill', text: 'Late start, but feeling cozy ☕', time: 'Morning' }
  ]);

  const [home, setHome] = useState<{ streak: number; messagesCount: number; memoriesCount: number; relationshipAgeDays: number; nextBirthday: { name: string; daysToGo: number } | null } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [summary, items] = await Promise.all([
          fetchHomeSummary(token),
          fetchVibeCheckSummary(token)
        ]);
        setHome({ 
          streak: summary.streak, 
          messagesCount: summary.messagesCount, 
          memoriesCount: summary.memoriesCount, 
          relationshipAgeDays: summary.relationshipAgeDays,
          nextBirthday: summary.nextBirthday
        });
        if (Array.isArray(items) && items.length) setTodayCheckins(items);
      } catch {}
    })();
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  })();


  const handleShare = async (vibe: string, moodLabel: string) => {
    setTodayCheckins([{ author: currentUserName, mood: moodLabel, text: vibe, time: 'Just now' }, ...todayCheckins]);
    try {
      const token = await getToken();
      if (token) await recordVibeCheck(token, moodLabel, vibe);
    } catch {}
    setShowShareVibe(false);
  };

  return (
    <View style={{ flex: 1, paddingBottom: 96, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={themeGradientMap[selectedTheme] ?? (darkMode ? ['#7C3AED', '#EF4444'] : ['#FF6B9D', '#C44569'])} style={{ paddingHorizontal: 24, paddingVertical: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View />
          <Pressable onPress={onOpenSettings}><Settings size={24} color={'#fff'} /></Pressable>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' }}>{greeting}, bestie! 👋</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>{`${bestieName} & ${currentUserName}`}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{home?.relationshipAgeDays ?? 0} days of friendship 💖</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', alignItems: 'center' }}>
            <Zap size={24} color={'#F59E0B'} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>{home?.streak ?? 0}</Text>
            <Text style={{ fontSize: 11, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Day Streak</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', alignItems: 'center' }}>
            <Heart size={24} color={'#EC4899'} fill={'#EC4899'} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>{home?.messagesCount ?? 0}</Text>
            <Text style={{ fontSize: 11, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Messages</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', alignItems: 'center' }}>
            <Camera size={24} color={'#3B82F6'} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>{home?.memoriesCount ?? 0}</Text>
            <Text style={{ fontSize: 11, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Memories</Text>
          </View>
        </View>
        <LinearGradient colors={themeGradientMap[selectedTheme] ?? (darkMode ? ['#7C3AED', '#EC4899'] : ['#A78BFA', '#F472B6'])} style={{ borderRadius: 20, padding: 20 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>✨ Today's Vibe Check</Text>
          <Text style={{ color: '#fff', fontSize: 15, marginTop: 8 }}>
            {todayCheckins.length ? `"${todayCheckins[0].text}"` : 'No vibes yet — share yours!'}
          </Text>
          {todayCheckins.length ? (
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>{todayCheckins[0].mood}</Text>
          ) : null}
          {todayCheckins.length ? (
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 }}>by {todayCheckins[0].author}</Text>
          ) : null}
          <Pressable onPress={() => setShowShareVibe(true)}>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 8 }}>Share your vibe →</Text>
          </Pressable>
          <View style={{ marginTop: 12 }}>
            {todayCheckins.slice(0,3).map((c, i) => (
              <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, marginTop: 8 }}>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{c.author} • {c.mood}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>{c.text}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        
        {home?.nextBirthday ? (
          <View style={{ borderRadius: 16, padding: 16, borderWidth: 2, borderColor: darkMode ? 'rgba(234,179,8,0.5)' : '#FDE68A', backgroundColor: darkMode ? '#1F2937' : '#FEF3C7', flexDirection: 'row', gap: 12 }}>
            <Gift size={32} color={'#EC4899'} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#fff' : '#111827' }}>{home.nextBirthday.name}'s Birthday</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#DB2777', marginTop: 4 }}>{home.nextBirthday.daysToGo === 0 ? 'Today! 🎂' : `${home.nextBirthday.daysToGo} days to go! 🎉`}</Text>
              <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#4B5563', marginTop: 4 }}>Time to plan something epic!</Text>
            </View>
          </View>
        ) : null}

      </ScrollView>
      {showShareVibe && (
        <ShareVibeModal
          darkMode={darkMode}
          onClose={() => setShowShareVibe(false)}
          onShare={handleShare}
        />
      )}

    </View>
  );
}