import { View, Text, Pressable, Alert } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithGoogle } from '../lib/api';
import { useEffect } from 'react';

interface WelcomeScreenProps {
  onSignedIn: () => void;
}

export function WelcomeScreen({ onSignedIn }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
    });
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      let idToken = result.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      if (!idToken) {
        Alert.alert('Google Sign-In failed', 'Missing id token. Check web client ID configuration.');
        return;
      }
      await signInWithGoogle(idToken);
      onSignedIn();
    } catch (error: any) {
      const message = error?.message || 'Unknown error';
      Alert.alert('Sign-in failed', message);
    }
  };
  return (
    <LinearGradient colors={["#FF6B9D", "#C44569", "#9B59B6"]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: insets.top }}>
      <View style={{ width: '100%', maxWidth: 480 }}>
        <View style={{ alignItems: 'center', gap: 24 }}>
          <Sparkles size={56} color="#FFF5E1" />
          <Text style={{ fontSize: 48, color: '#fff', fontWeight: '700', textAlign: 'center' }}>BFF Zone</Text>
          <Text style={{ color: '#FFF5E1', fontSize: 17, textAlign: 'center' }}>Your private bestie space ✨{"\n"}Just you two. No drama. All vibes.</Text>
        </View>
        <View style={{ paddingTop: 24 }}>
          <Pressable onPress={handleGoogleSignIn} style={{ height: 56, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#111827', fontSize: 17, fontWeight: '600' }}>Continue with Google</Text>
          </Pressable>
          <Text style={{ color: '#FFE4E1', fontSize: 13, textAlign: 'center', marginTop: 20 }}>Private & secure. Only you and your bestie. 💕</Text>
        </View>
      </View>
    </LinearGradient>
  );
}