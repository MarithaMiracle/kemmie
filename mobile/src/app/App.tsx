import { useEffect, useState } from "react";
import { View, Pressable } from 'react-native';
import { LaunchScreen } from "../app/components/launch-screen";
import { WelcomeScreen } from "../app/components/welcome-screen";
import { LoadingScreen } from "../app/components/loading-screen";
import { BottomNav } from "../app/components/bottom-nav";
import { HomeScreen } from "../app/components/home-screen";
import { StreakScreen } from "../app/components/streak-screen";
import { VibesScreen } from "../app/components/vibes-screen";
import { ChatScreen } from "../app/components/chat-screen";
import { MemoriesScreen } from "../app/components/memories-screen";
import { SettingsScreen } from "../app/components/settings-screen";
import { Settings } from "lucide-react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getToken, fetchIdentityNames } from "./lib/api";
import * as SecureStore from 'expo-secure-store';

type AppState = "launch" | "welcome" | "loading" | "authenticated";
type NavItem = "today" | "streak" | "vibes" | "chat" | "memories";

export default function App() {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState<AppState>("launch");
  const [currentScreen, setCurrentScreen] = useState<NavItem>("chat");
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('pink-purple');
  const [currentUserName, setCurrentUserName] = useState('Maritha');
  const [bestieName, setBestieName] = useState('Kemmie');

  useEffect(() => {
    (async () => {
      try {
        const dm = await SecureStore.getItemAsync('pref_darkMode');
        if (dm !== null) setDarkMode(dm === 'true');
        const th = await SecureStore.getItemAsync('pref_theme');
        if (th) setSelectedTheme(th);
      } catch {}
    })();
  }, []);

  const handleLaunchComplete = () => {
    setAppState("welcome");
  };

  const handleSignedIn = () => {
    setAppState("authenticated");
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      SecureStore.setItemAsync('pref_darkMode', next ? 'true' : 'false');
      return next;
    });
  };

  useEffect(() => {
    if (appState !== "authenticated") return;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const { currentUserName: me, bestieName: partner } = await fetchIdentityNames(token);
        if (me) setCurrentUserName(me);
        if (partner) setBestieName(partner);
      } catch {}
    })();
  }, [appState]);

  if (appState === "launch") {
    return <LaunchScreen onComplete={handleLaunchComplete} />;
  }

  if (appState === "welcome") {
    return <WelcomeScreen onSignedIn={handleSignedIn} />;
  }

  if (appState === "loading") {
    return <LoadingScreen />;
  }

  // Show settings as overlay
  if (showSettings) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
        <SettingsScreen
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          selectedTheme={selectedTheme}
          onThemeChange={(theme) => { setSelectedTheme(theme); SecureStore.setItemAsync('pref_theme', theme); }}
          onClose={() => setShowSettings(false)}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {currentScreen === 'chat' && <ChatScreen darkMode={darkMode} />}
      {currentScreen === 'today' && (
        <HomeScreen darkMode={darkMode} selectedTheme={selectedTheme} onOpenSettings={() => setShowSettings(true)} onOpenVibes={() => setCurrentScreen('vibes')} currentUserName={currentUserName} bestieName={bestieName} />
      )}
      {currentScreen === 'streak' && <StreakScreen darkMode={darkMode} />}
      {currentScreen === 'vibes' && <VibesScreen darkMode={darkMode} selectedTheme={selectedTheme} currentUserName={currentUserName} bestieName={bestieName} />}
      {currentScreen === 'memories' && <MemoriesScreen darkMode={darkMode} selectedTheme={selectedTheme} />}
      <BottomNav active={currentScreen} onNavigate={setCurrentScreen} />
      <Pressable onPress={() => setShowSettings(true)} hitSlop={8} style={{ position: 'absolute', top: insets.top + 16, right: 16, backgroundColor: darkMode ? '#374151' : '#FFFFFF', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
        <Settings size={22} color={darkMode ? '#FFFFFF' : '#111827'} />
      </Pressable>
    </View>
  );
}