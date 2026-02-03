import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Moon, Sun, Bell, Lock, User, Heart, Info, LogOut, Palette, Zap } from "lucide-react-native";
import { Switch } from "./ui/switch";
import { ThemeColorsScreen } from "./settings/theme-colors-screen";
import { NotificationsScreen } from "./settings/notifications-screen";
import { ProfileScreen } from "./settings/profile-screen";
import { BestieScreen } from "./settings/bestie-screen";
import * as SecureStore from 'expo-secure-store';
import { getToken, updateNotificationSettings } from "../lib/api";
import { ensurePushRegistration, setupNotificationHandler } from '../lib/notifications';

interface SettingsScreenProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

type SettingsView = "main" | "theme" | "notifications" | "profile" | "bestie" | "privacy" | "about";

export function SettingsScreen({ darkMode, onToggleDarkMode, onClose, selectedTheme, onThemeChange }: SettingsScreenProps) {
  const [currentView, setCurrentView] = useState<SettingsView>("main");

  const [notifications, setNotifications] = useState({
    messages: true,
    streaks: true,
    memories: false,
    homeVibeShares: false,
    vibeAdds: false,
    memoryAdds: false,
  });

  useEffect(() => { setupNotificationHandler(); }, []);
  useEffect(() => { if (Object.values(notifications).some(Boolean)) { ensurePushRegistration().catch(() => {}); } }, [notifications]);

  const handleToggleNotification = (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    (async () => {
      try {
        await SecureStore.setItemAsync('pref_notifications', JSON.stringify(next));
        const token = await getToken();
        if (token) await updateNotificationSettings(token, next);
      } catch {}
    })();
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { try { await SecureStore.deleteItemAsync('accessToken'); } catch {} onClose(); } }
    ]);
  };

  // Show sub-screens
  if (currentView === "theme") {
    return (
      <ThemeColorsScreen
        darkMode={darkMode}
        onBack={() => setCurrentView("main")}
        selectedTheme={selectedTheme}
        onThemeChange={onThemeChange}
      />
    );
  }

  if (currentView === "notifications") {
    return (
      <NotificationsScreen
        darkMode={darkMode}
        onBack={() => setCurrentView("main")}
        notifications={notifications}
        onToggle={handleToggleNotification}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <ProfileScreen
        darkMode={darkMode}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  if (currentView === "bestie") {
    return (
      <BestieScreen
        darkMode={darkMode}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  if (currentView === "privacy") {
    return (
      <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
        <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable onPress={() => setCurrentView("main")}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Privacy</Text>
            <View style={{ width: 56 }} />
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Your Privacy Matters</Text>
            <Text style={{ fontSize: 14, marginTop: 12, color: darkMode ? '#D1D5DB' : '#6B7280' }}>
              BFF Zone is designed to be a private space for you and your bestie. All your data is encrypted and never shared with third parties.
            </Text>
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>✓ End-to-end encryption</Text>
              <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>✓ No data selling</Text>
              <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>✓ Delete anytime</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentView === "about") {
    return (
      <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
        <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable onPress={() => setCurrentView("main")}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>About</Text>
            <View style={{ width: 56 }} />
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>💕</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>BFF Zone</Text>
            <Text style={{ fontSize: 14, marginTop: 8, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Version 1.0.0</Text>
          </View>
          <View style={{ marginTop: 16, borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <Text style={{ fontSize: 14, color: darkMode ? '#D1D5DB' : '#6B7280' }}>
              BFF Zone is your private space to connect with your best friend. Share vibes, track memories, and keep your friendship strong! ✨
            </Text>
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: darkMode ? '#374151' : '#E5E7EB' }}>
              <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Made with 💕 for besties everywhere</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main settings view
  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onClose}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Settings</Text>
          <View style={{ width: 56 }} />
        </View>
      </LinearGradient>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
          <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: darkMode ? '#374151' : '#FCE7F3', borderBottomWidth: 1, borderBottomColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: darkMode ? '#D1D5DB' : '#6B7280' }}>APPEARANCE</Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {darkMode ? <Moon size={22} color="#A78BFA" /> : <Sun size={22} color="#F59E0B" />}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Dark Mode</Text>
                    <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{darkMode ? 'Night owl mode 🌙' : 'Bright & vibrant ☀️'}</Text>
                  </View>
                </View>
                <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
              </View>
              <Pressable onPress={() => setCurrentView('theme')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Palette size={22} color="#EC4899" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Theme Colors</Text>
                    <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{selectedTheme}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: darkMode ? '#374151' : '#FCE7F3', borderBottomWidth: 1, borderBottomColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: darkMode ? '#D1D5DB' : '#6B7280' }}>ACCOUNT</Text>
            </View>
            <Pressable onPress={() => setCurrentView('profile')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <User size={22} color="#3B82F6" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Profile</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Edit your info</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={() => setCurrentView('bestie')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Heart size={22} color="#EC4899" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Your Bestie</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Kemmie</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: darkMode ? '#374151' : '#FCE7F3', borderBottomWidth: 1, borderBottomColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: darkMode ? '#D1D5DB' : '#6B7280' }}>NOTIFICATIONS</Text>
            </View>
            <Pressable onPress={() => setCurrentView('notifications')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Bell size={22} color="#F59E0B" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Push Notifications</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Stay in the loop</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Zap size={22} color="#F59E0B" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Streak Reminders</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{notifications.streaks ? 'On' : 'Off'}</Text>
                </View>
              </View>
              <Switch checked={notifications.streaks} onCheckedChange={() => handleToggleNotification('streaks')} />
            </View>
          </View>

          <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: darkMode ? '#374151' : '#FCE7F3', borderBottomWidth: 1, borderBottomColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: darkMode ? '#D1D5DB' : '#6B7280' }}>PRIVACY & SECURITY</Text>
            </View>
            <Pressable onPress={() => setCurrentView('privacy')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Lock size={22} color="#10B981" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Privacy Settings</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Your data, your control</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
            <Pressable onPress={() => setCurrentView('about')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Info size={22} color="#8B5CF6" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>About BFF Zone</Text>
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Version 1.0.0</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <Pressable onPress={handleSignOut} style={{ marginTop: 16, borderRadius: 16, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
              <LogOut size={22} color="#EF4444" />
              <Text style={{ marginLeft: 8, color: '#EF4444', fontSize: 16, fontWeight: '600' }}>Sign Out</Text>
            </View>
          </Pressable>

          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}>
            <Text style={{ fontSize: 13, color: darkMode ? '#6B7280' : '#9CA3AF' }}>Made with 💕 for besties everywhere</Text>
          </View>
        </ScrollView>
      </View>
  );
}