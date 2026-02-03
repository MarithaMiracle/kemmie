import * as React from "react";
import { View, Pressable, Text, Modal, StyleSheet } from "react-native";

const ItemOpenCtx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
const navStyles = StyleSheet.create({
  trigger: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
});
const navigationMenuTriggerStyle = () => navStyles.trigger;

function NavigationMenu({ children, viewport }: { children?: React.ReactNode; viewport?: boolean }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>{children}</View>;
}

function NavigationMenuList({ children }: { children?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{children}</View>;
}

function NavigationMenuItem({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <ItemOpenCtx.Provider value={{ open, setOpen }}><View>{children}</View></ItemOpenCtx.Provider>;
}


function NavigationMenuTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(ItemOpenCtx);
  return (
    <Pressable onPress={() => ctx?.setOpen(!ctx.open)} style={navStyles.trigger}>
      {typeof children === 'string' ? <Text style={{ fontWeight: '600' }}>{children}</Text> : children}
      <Text style={{ marginLeft: 4, color: '#9CA3AF' }}>{ctx?.open ? '▴' : '▾'}</Text>
    </Pressable>
  );
}

function NavigationMenuContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(ItemOpenCtx);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 16 }} onPress={() => ctx?.setOpen(false)}>
        <View style={{ borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function NavigationMenuViewport({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function NavigationMenuLink({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function NavigationMenuIndicator() {
  const ctx = React.useContext(ItemOpenCtx);
  if (!ctx?.open) return null;
  return <View style={{ height: 6, width: 6, transform: [{ rotate: '45deg' }], backgroundColor: '#E5E7EB', alignSelf: 'center', marginTop: 4 }} />;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
