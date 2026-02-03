import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../ui/button";
import { Heart, UserX, Calendar, Zap, MessageCircle } from "lucide-react-native";
import { getToken, fetchHomeSummary, removeBestie } from "../../lib/api";

interface BestieScreenProps {
  darkMode: boolean;
  onBack: () => void;
}

export function BestieScreen({ darkMode, onBack }: BestieScreenProps) {
  const [stats, setStats] = React.useState<{ streak: number; messagesCount: number; memoriesCount: number; lastActiveSeconds: number } | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const s = await fetchHomeSummary(token);
        setStats({ streak: s.streak, messagesCount: s.messagesCount, memoriesCount: s.memoriesCount, lastActiveSeconds: s.lastActiveSeconds });
      } catch {}
    })();
  }, []);
  const formatAgo = (s: number) => { const m = Math.floor(s / 60); if (m < 60) return `${m} minutes ago`; const h = Math.floor(m / 60); if (h < 24) return `${h} hours ago`; const d = Math.floor(h / 24); return `${d} days ago`; };
  const handleRemoveBestie = () => {
    Alert.alert(
      "Remove Bestie",
      "Are you sure you want to remove Kemmie as your bestie? This will delete all shared data and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: async () => { try { const token = await getToken(); if (!token) return; await removeBestie(token); Alert.alert('Removed', 'Your bestie has been removed.'); onBack(); } catch {} } }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onBack}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Your Bestie</Text>
          <View style={{ width: 56 }} />
        </View>
      </LinearGradient>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Bestie Profile Card */}
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 24 }}>💕</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>Kemmie</Text>
              <Text style={{ fontSize: 14, marginTop: 4, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Your BFF since January 2026</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <View style={{ width: '48%', borderRadius: 12, padding: 12, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Zap size={18} color="#F59E0B" />
                <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: darkMode ? '#9CA3AF' : '#6B7280' }}>STREAK</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>{(stats?.streak ?? 0)} 🔥</Text>
            </View>
            <View style={{ width: '48%', borderRadius: 12, padding: 12, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <MessageCircle size={18} color="#3B82F6" />
                <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: darkMode ? '#9CA3AF' : '#6B7280' }}>MESSAGES</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>{stats?.messagesCount ?? 0}</Text>
            </View>
            <View style={{ width: '48%', borderRadius: 12, padding: 12, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Heart size={18} color="#EC4899" />
                <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: darkMode ? '#9CA3AF' : '#6B7280' }}>VIBES</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>156</Text>
            </View>
            <View style={{ width: '48%', borderRadius: 12, padding: 12, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Calendar size={18} color="#8B5CF6" />
                <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: darkMode ? '#9CA3AF' : '#6B7280' }}>MEMORIES</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>{stats?.memoriesCount ?? 0}</Text>
            </View>
          </View>

          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: darkMode ? '#FFFFFF' : '#111827' }}>Connection Details</Text>
            <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Connected since</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Jan 1, 2026</Text>
            </View>
            <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Status</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 }} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Active</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Last active</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>{formatAgo(stats?.lastActiveSeconds ?? 0)}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: darkMode ? '#FFFFFF' : '#111827' }}>Quick Actions</Text>
            <View>
              <Button onPress={() => {}} style={{ height: 44, borderRadius: 12, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MessageCircle size={18} color="#fff" />
                  <Text style={{ marginLeft: 8, color: '#fff', fontWeight: '600' }}>Send Message</Text>
                </View>
              </Button>
              <View style={{ height: 8 }} />
              <Button onPress={() => {}} style={{ height: 44, borderRadius: 12, backgroundColor: darkMode ? '#374151' : '#E5E7EB', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calendar size={18} color={darkMode ? '#D1D5DB' : '#374151'} />
                  <Text style={{ marginLeft: 8, color: darkMode ? '#FFFFFF' : '#111827', fontWeight: '600' }}>View Shared Memories</Text>
                </View>
              </Button>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? 'rgba(76, 29, 29, 0.2)' : '#FEE2E2', borderWidth: darkMode ? 0 : 1, borderColor: '#FCA5A5' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: darkMode ? '#FCA5A5' : '#B91C1C' }}>Danger Zone</Text>
            <Text style={{ fontSize: 13, marginBottom: 12, color: darkMode ? 'rgba(252, 165, 165, 0.7)' : '#DC2626' }}>
              Removing your bestie will permanently delete all shared data including messages, vibes, and memories.
            </Text>
            <Pressable onPress={handleRemoveBestie} style={{ borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: darkMode ? 'rgba(76, 29, 29, 0.5)' : '#FCA5A5', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
              <UserX size={18} color={darkMode ? '#FCA5A5' : '#7F1D1D'} />
              <Text style={{ marginLeft: 8, fontWeight: '600', color: darkMode ? '#FCA5A5' : '#7F1D1D' }}>Remove Bestie</Text>
            </Pressable>
          </View>

          {/* Footer Spacing */}
          <View style={{ height: 16 }} />
        </ScrollView>
      </View>
  );
}
