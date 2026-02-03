import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Calendar, Award, Star, Trophy } from "lucide-react-native";
import { getToken, fetchStreakSummary, fetchAchievements } from "../lib/api";

interface StreakScreenProps { darkMode: boolean }
export function StreakScreen({ darkMode }: StreakScreenProps) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [summary, setSummary] = useState<{ streakDays: number; bestStreakDays: number; week: boolean[]; lastActiveSeconds: number } | null>(null);
  const [achievements, setAchievements] = useState<Array<{ key: string; title: string; description: string; icon: string; unlocked: boolean; remainingDays: number }>>([]);
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [s, a] = await Promise.all([
          fetchStreakSummary(token),
          fetchAchievements(token)
        ]);
        setSummary(s);
        setAchievements(a);
      } catch {}
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 96, paddingHorizontal: 24, paddingTop: 24, backgroundColor: darkMode ? '#111827' : '#FFF7ED' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ borderRadius: 9999, padding: 16, backgroundColor: '#F97316' }}>
          <Flame size={48} color="#fff" fill="#fff" />
        </View>
        <Text style={{ color: '#111827', fontSize: 32, fontWeight: '700', marginTop: 12 }}>{(summary?.streakDays ?? 0)} Day Streak! 🔥</Text>
        <Text style={{ color: '#6B7280', fontSize: 15 }}>You're on fire! Keep the energy going</Text>
      </View>

      <View style={{ marginTop: 24, borderRadius: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', padding: 16 }}>
        <Text style={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>This Week</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {weekDays.map((day, index) => (
            <View key={day} style={{ alignItems: 'center' }}>
              <Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11, marginBottom: 8 }}>{day}</Text>
              <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: (summary?.week?.[index] ? '#F97316' : '#E5E7EB') }}>
                {summary?.week?.[index] && (<Flame size={20} color="#fff" fill="#fff" />)}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 16, borderRadius: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', padding: 16 }}>
        <Text style={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>🏆 Achievements Unlocked</Text>
        {achievements.map((a) => {
          const unlocked = a.unlocked;
          const bg = a.icon === 'star' ? '#FFFBEB' : a.icon === 'award' ? '#F5F3FF' : '#F9FAFB';
          const border = a.icon === 'star' ? '#FDE68A' : a.icon === 'award' ? '#DDD6FE' : '#E5E7EB';
          return (
            <View key={a.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: bg, borderColor: border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8, opacity: unlocked ? 1 : 0.6 }}>
              <View style={{ backgroundColor: unlocked ? (a.icon === 'star' ? '#FBBF24' : a.icon === 'award' ? '#A78BFA' : '#D1D5DB') : '#D1D5DB', borderRadius: 9999, padding: 8 }}>
                {a.icon === 'star' && <Star size={20} color={unlocked ? '#fff' : '#6B7280'} {...(unlocked ? { fill: '#fff' } : {})} />}
                {a.icon === 'award' && <Award size={20} color={unlocked ? '#fff' : '#6B7280'} {...(unlocked ? { fill: '#fff' } : {})} />}
                {a.icon === 'trophy' && <Trophy size={20} color={unlocked ? '#fff' : '#6B7280'} {...(unlocked ? { fill: '#fff' } : {})} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: unlocked ? (darkMode ? '#FFFFFF' : '#111827') : '#6B7280', fontSize: 14, fontWeight: '600' }}>{a.title}</Text>
                <Text style={{ color: '#6B7280', fontSize: 12 }}>{unlocked ? a.description : `Locked - ${a.remainingDays} days to go`}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <LinearGradient colors={["#F97316", "#EC4899"]} style={{ marginTop: 16, borderRadius: 16, padding: 16 }}>
        <Text style={{ color: '#fff', fontSize: 15 }}>Send a message or complete a challenge to keep your streak alive! 💪</Text>
      </LinearGradient>
    </ScrollView>
  );
}

