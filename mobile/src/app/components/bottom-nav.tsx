import { Home, Flame, Sparkles, MessageCircle, Camera } from "lucide-react-native";
import { View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavItem = "today" | "streak" | "vibes" | "chat" | "memories";

interface BottomNavProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const items: { id: NavItem; icon: typeof Home; label: string }[] = [
    { id: "today", icon: Home, label: "Home" },
    { id: "streak", icon: Flame, label: "Streak" },
    { id: "vibes", icon: Sparkles, label: "Vibes" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "memories", icon: Camera, label: "Vault" },
  ];

  return (
    <View style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#FBCFE8' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 64 }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Pressable key={item.id} onPress={() => onNavigate(item.id)} style={{ alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
              <Icon size={22} color={isActive ? '#FF6B9D' : '#9CA3AF'} strokeWidth={isActive ? 2.5 : 2} />
              <Text style={{ fontSize: 10, color: isActive ? '#FF6B9D' : '#9CA3AF', fontWeight: isActive ? '600' : '500' }}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}