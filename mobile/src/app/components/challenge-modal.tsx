import { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Camera, Image, Sparkles, Trophy, Check } from "lucide-react-native";
import { Button } from "./ui/button";

interface ChallengeModalProps {
  darkMode: boolean;
  onClose: () => void;
  onComplete: (author: string) => void;
  challenge: {
    title: string;
    description: string;
    points: number;
  };
  currentUserName: string;
  bestieName: string;
  initialAuthor?: string;
}

export function ChallengeModal({ darkMode, onClose, onComplete, challenge, currentUserName, bestieName, initialAuthor }: ChallengeModalProps) {
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [activeAuthor, setActiveAuthor] = useState<string>(initialAuthor ?? currentUserName);

  const handleImageSelect = () => {
    // Simulate image selection
    setSelectedImage("selected");
    setStep("preview");
  };

  const handleComplete = () => {
    setStep("success");
    setTimeout(() => {
      onComplete(activeAuthor);
      onClose();
    }, 2000);
  };

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={onClose}>
        <View style={{ margin: 24, borderRadius: 24, overflow: 'hidden', maxHeight: '90%', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
        <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Trophy size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginLeft: 8 }}>
                {step === "success" ? "Challenge Complete!" : "Complete Challenge"}
              </Text>
            </View>
            {step !== "success" && (
              <Pressable onPress={onClose} hitSlop={8}>
                <X size={24} color="#fff" />
              </Pressable>
            )}
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {step === "upload" && (
            <View>
              <View style={{ borderRadius: 16, padding: 16, backgroundColor: darkMode ? '#374151' : '#F8F0FC' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ borderRadius: 9999, padding: 8, backgroundColor: '#8B5CF6', marginRight: 8 }}>
                    <Trophy size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>{challenge.title}</Text>
                    <Text style={{ fontSize: 14, color: darkMode ? '#D1D5DB' : '#6B7280' }}>{challenge.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                      <Sparkles size={16} color="#F59E0B" />
                      <Text style={{ marginLeft: 4, color: '#CA8A04', fontSize: 14, fontWeight: '600' }}>+{challenge.points} points</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                {[currentUserName, bestieName].map((name) => {
                  const active = activeAuthor === name;
                  return (
                    <Pressable key={name} onPress={() => setActiveAuthor(name)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, marginRight: 8, backgroundColor: active ? (darkMode ? '#374151' : '#F3E8FF') : (darkMode ? '#1F2937' : '#F3F4F6'), borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#E5E7EB' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>{name}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827', marginBottom: 8 }}>Upload your selfie:</Text>
                <Pressable onPress={handleImageSelect} style={[{ padding: 20, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }, darkMode ? { borderColor: '#4B5563', backgroundColor: '#374151' } : { borderColor: '#D1D5DB', backgroundColor: '#F3E8FF' }]}>
                  <Camera size={32} color="#8B5CF6" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Take a Photo</Text>
                    <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Use your camera</Text>
                  </View>
                </Pressable>
                <Pressable onPress={handleImageSelect} style={[{ marginTop: 8, padding: 20, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }, darkMode ? { borderColor: '#4B5563', backgroundColor: '#374151' } : { borderColor: '#D1D5DB', backgroundColor: '#FCE7F3' }]}>
                  <Image size={32} color="#EC4899" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827' }}>Choose from Gallery</Text>
                    <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Select a photo</Text>
                  </View>
                </Pressable>
                <Text style={{ textAlign: 'center', fontSize: 13, marginTop: 8, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Make your bestie smile! 😊</Text>
              </View>
            </View>
          )}

          {step === "preview" && (
            <View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827', marginBottom: 8 }}>Preview:</Text>
                <LinearGradient colors={["#DDD6FE", "#FBCFE8", "#FEF3C7"]} style={{ borderRadius: 16, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={48} color="rgba(255,255,255,0.9)" />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', marginTop: 8 }}>Your awesome selfie! 📸</Text>
                </LinearGradient>
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: darkMode ? '#FFFFFF' : '#111827', marginBottom: 8 }}>Add a caption (optional):</Text>
                <TextInput value={caption} onChangeText={setCaption} placeholder="Say something fun..." placeholderTextColor="#9CA3AF" multiline style={[{ minHeight: 96, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, lineHeight: 22, color: darkMode ? '#FFFFFF' : '#111827' }, darkMode ? { borderColor: '#4B5563', backgroundColor: '#374151' } : { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }]} maxLength={100} />
                <Text style={{ textAlign: 'right', fontSize: 12, marginTop: 4, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{caption.length}/100</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Button onPress={() => setStep('upload')} style={[{ height: 48, borderRadius: 9999 }, darkMode ? { backgroundColor: '#374151' } : { backgroundColor: '#E5E7EB' }]} textStyle={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>Change Photo</Button>
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Button onPress={handleComplete} style={{ height: 48, borderRadius: 9999, backgroundColor: '#8B5CF6' }} textStyle={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Submit Challenge</Button>
                </View>
              </View>
            </View>
          )}

          {step === "success" && (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={48} color="#fff" />
              </View>
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>Amazing! 🎉</Text>
                <Text style={{ fontSize: 15, color: darkMode ? '#D1D5DB' : '#6B7280' }}>Challenge completed!</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280', marginTop: 4 }}>Completed by {activeAuthor}</Text>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280', marginTop: 4 }}>Completed by {activeAuthor}</Text>
              </View>
              <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, marginTop: 12 }, darkMode ? { backgroundColor: '#374151', borderWidth: 2, borderColor: '#F59E0B' } : { backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: '#F59E0B' }]}>
                <Sparkles size={20} color="#F59E0B" />
                <Text style={{ marginLeft: 8, color: '#CA8A04', fontSize: 18, fontWeight: '700' }}>+{challenge.points} points</Text>
              </View>
              <Text style={{ fontSize: 14, marginTop: 8, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Your bestie will love this! 💕</Text>
            </View>
          )}
        </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
