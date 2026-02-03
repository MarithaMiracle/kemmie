import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function LoadingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={["#FF6B9D", "#C44569", "#9B59B6"]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: insets.top }}>
      <View style={{ width: '100%', maxWidth: 480, alignItems: 'center', gap: 16 }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Getting your bestie space ready...</Text>
      </View>
    </LinearGradient>
  );
}