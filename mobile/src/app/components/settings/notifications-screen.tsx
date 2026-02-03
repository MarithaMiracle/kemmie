import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, MessageCircle, Zap, Calendar, Sparkles, PlusCircle } from "lucide-react-native";
import { Switch } from "../ui/switch";
import { ensurePushRegistration, setupNotificationHandler } from '../../lib/notifications';

interface NotificationsScreenProps {
  darkMode: boolean;
  onBack: () => void;
  notifications: {
    messages: boolean;
    streaks: boolean;
    memories: boolean;
    homeVibeShares: boolean;
    vibeAdds: boolean;
    memoryAdds: boolean;
  };
  onToggle: (key: keyof NotificationsScreenProps['notifications']) => void;
}

export function NotificationsScreen({ darkMode, onBack, notifications, onToggle }: NotificationsScreenProps) {
  useEffect(() => { setupNotificationHandler(); }, []);
  useEffect(() => { if (notifications.messages || notifications.streaks || notifications.memories || notifications.homeVibeShares || notifications.vibeAdds || notifications.memoryAdds) { ensurePushRegistration().catch(() => {}); } }, [notifications]);
  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onBack}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Notifications</Text>
          <View style={{ width: 56 }} />
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280', marginBottom: 12 }}>Stay connected with your bestie 💕</Text>
        <View style={{ borderRadius: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MessageCircle size={22} color="#EC4899" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>New Messages</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Get notified instantly</Text>
              </View>
            </View>
            <Switch checked={notifications.messages} onCheckedChange={() => onToggle('messages')} />
          </View>
          <View style={{ height: 1, backgroundColor: darkMode ? '#374151' : '#F3F4F6' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Zap size={22} color="#F59E0B" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Streak Reminders</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Don't break the streak! 🔥</Text>
              </View>
            </View>
            <Switch checked={notifications.streaks} onCheckedChange={() => onToggle('streaks')} />
          </View>
          <View style={{ height: 1, backgroundColor: darkMode ? '#374151' : '#F3F4F6' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={22} color="#3B82F6" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Memory Reminders</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>On this day memories</Text>
              </View>
            </View>
            <Switch checked={notifications.memories} onCheckedChange={() => onToggle('memories')} />
          </View>
          <View style={{ height: 1, backgroundColor: darkMode ? '#374151' : '#F3F4F6' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Sparkles size={22} color="#EC4899" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Vibe Shares (Home)</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>When a vibe is shared on Home</Text>
              </View>
            </View>
            <Switch checked={notifications.homeVibeShares} onCheckedChange={() => onToggle('homeVibeShares')} />
          </View>
          <View style={{ height: 1, backgroundColor: darkMode ? '#374151' : '#F3F4F6' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlusCircle size={22} color="#7C3AED" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Vibe Adds (Vibes)</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>When a vibe is added in Vibes</Text>
              </View>
            </View>
            <Switch checked={notifications.vibeAdds} onCheckedChange={() => onToggle('vibeAdds')} />
          </View>
          <View style={{ height: 1, backgroundColor: darkMode ? '#374151' : '#F3F4F6' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlusCircle size={22} color="#3B82F6" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Memory Adds (Vault)</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>When a memory is added</Text>
              </View>
            </View>
            <Switch checked={notifications.memoryAdds} onCheckedChange={() => onToggle('memoryAdds')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
