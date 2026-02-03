import { useState } from "react";
import { Modal, View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles } from "lucide-react-native";
import { Button } from "./ui/button";

interface ShareVibeModalProps {
  darkMode: boolean;
  onClose: () => void;
  onShare: (vibe: string, mood: string) => void;
}

export function ShareVibeModal({ darkMode, onClose, onShare }: ShareVibeModalProps) {
  const [vibeText, setVibeText] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const moods = [
    { emoji: "✨", label: "Energized", color: "from-yellow-400 to-orange-400" },
    { emoji: "💪", label: "Motivated", color: "from-purple-400 to-pink-400" },
    { emoji: "☀️", label: "Happy", color: "from-yellow-300 to-pink-300" },
    { emoji: "😌", label: "Chill", color: "from-blue-300 to-purple-300" },
    { emoji: "🌙", label: "Tired", color: "from-indigo-400 to-purple-400" },
    { emoji: "💕", label: "Grateful", color: "from-pink-400 to-red-400" },
    { emoji: "🔥", label: "On Fire", color: "from-orange-400 to-red-500" },
    { emoji: "🌈", label: "Peaceful", color: "from-green-300 to-blue-300" },
  ];

  const handleShare = () => {
    if (vibeText.trim() && selectedMood) {
      onShare(vibeText, selectedMood);
      onClose();
    }
  };
  const disabled = !vibeText.trim() || !selectedMood;

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={onClose}>
        <View style={{ margin: 24, borderRadius: 24, overflow: 'hidden', maxHeight: '90%', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
          <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles size={24} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginLeft: 8 }}>Share Your Vibe</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8}>
                <X size={24} color="#fff" />
              </Pressable>
            </View>
          </LinearGradient>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827', marginBottom: 8 }}>How are you feeling?</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {moods.map((mood) => {
                  const active = selectedMood === mood.label;
                  return (
                    <Pressable key={mood.label} onPress={() => setSelectedMood(mood.label)} style={{ width: '24%', marginBottom: 12, borderRadius: 12, paddingVertical: 8, alignItems: 'center', backgroundColor: active ? '#8B5CF6' : (darkMode ? '#374151' : '#F3F4F6') }}>
                      <Text style={{ fontSize: 22 }}>{mood.emoji}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: active ? '#FFFFFF' : (darkMode ? '#D1D5DB' : '#374151'), marginTop: 4 }}>{mood.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827', marginBottom: 8 }}>What's on your mind?</Text>
              <TextInput
                value={vibeText}
                onChangeText={setVibeText}
                placeholder="Share what you're thinking or feeling..."
                placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                multiline
                style={[{ minHeight: 128, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, lineHeight: 22, color: darkMode ? '#FFFFFF' : '#111827' }, darkMode ? { borderColor: '#4B5563', backgroundColor: '#374151' } : { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }]}
                maxLength={200}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Express yourself ✨</Text>
                <Text style={{ fontSize: 12, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{vibeText.length}/200</Text>
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: darkMode ? '#9CA3AF' : '#6B7280', marginBottom: 8 }}>Quick picks:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {["Living my best life 💅", "Manifesting good vibes ✨", "Just vibing 🎵", "Feeling blessed 🙏"].map((s) => (
                  <Pressable key={s} onPress={() => setVibeText(s)} style={[{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, marginRight: 8, marginBottom: 8 }, darkMode ? { backgroundColor: '#374151' } : { backgroundColor: '#F3E8FF' }]}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: darkMode ? '#D1D5DB' : '#7C3AED' }}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Button
              onPress={handleShare}
              disabled={disabled}
              style={[{ height: 48, borderRadius: 9999 }, disabled ? { backgroundColor: '#E5E7EB' } : { backgroundColor: '#8B5CF6' }]}
              textStyle={disabled ? { color: '#9CA3AF', fontSize: 16, fontWeight: '600' } : { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}
            >
              Share Vibe ✨
            </Button>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
