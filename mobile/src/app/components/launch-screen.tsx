import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LaunchScreenProps {
  onComplete: () => void;
}

export function LaunchScreen({ onComplete }: LaunchScreenProps) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    // Auto transition after 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LinearGradient colors={["#FF6B9D", "#C44569", "#9B59B6"]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: insets.top }}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Sparkles size={80} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 52, fontWeight: '700' }}>BFF Zone</Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>Your bestie space ✨</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 80 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
          <View style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
          <View style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
        </View>
      </View>
    </LinearGradient>
  );
}
