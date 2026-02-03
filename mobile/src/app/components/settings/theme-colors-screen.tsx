import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";

interface ThemeColorsScreenProps {
  darkMode: boolean;
  onBack: () => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeColorsScreen({ darkMode, onBack, selectedTheme, onThemeChange }: ThemeColorsScreenProps) {
  const themes = [
    { id: 'pink-purple', name: 'Midnight', default: true },
    { id: 'blue-purple', name: 'Charcoal' },
    { id: 'pink-orange', name: 'Obsidian' },
    { id: 'green-blue', name: 'Forest Night' },
    { id: 'red-pink', name: 'Burgundy Night' },
    { id: 'purple-indigo', name: 'Deep Indigo' },
  ];
  const gradientMap: Record<string, string[]> = {
    'pink-purple': ['#0F172A', '#111827'],
    'blue-purple': ['#111827', '#1F2937'],
    'pink-orange': ['#0F172A', '#1F2937'],
    'green-blue': ['#064E3B', '#0F172A'],
    'red-pink': ['#3F0D12', '#111827'],
    'purple-indigo': ['#1E1B4B', '#0F172A'],
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={darkMode ? ['#0F172A', '#0F172A'] : ['#111827', '#1F2937']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onBack}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Theme Colors</Text>
          <View style={{ width: 56 }} />
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 14, marginBottom: 12, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Choose your vibe ✨</Text>
        {themes.map((theme) => (
          <Pressable key={theme.id} onPress={() => onThemeChange(theme.id)} style={{ borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', borderWidth: selectedTheme === theme.id ? 2 : 0, borderColor: selectedTheme === theme.id ? '#334155' : 'transparent' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LinearGradient colors={gradientMap[theme.id]} style={{ width: 64, height: 64, borderRadius: 12 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>{theme.name}</Text>
                {theme.default && (
                  <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Default theme</Text>
                )}
              </View>
              {selectedTheme === theme.id && (
                <View style={{ backgroundColor: '#334155', borderRadius: 12, padding: 4 }}>
                  <Check size={18} color="#FFFFFF" />
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
