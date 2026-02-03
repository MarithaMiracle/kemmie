import * as React from "react";
import { Modal, View, Pressable, Text, ViewStyle } from "react-native";

const DrawerCtx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Drawer({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <DrawerCtx.Provider value={{ open: value, setOpen: setValue }}>{children}</DrawerCtx.Provider>;
}

function DrawerTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DrawerCtx);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function DrawerPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function DrawerClose({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DrawerCtx);
  return <Pressable onPress={() => ctx?.setOpen(false)}>{children}</Pressable>;
}

function DrawerOverlay({ onPress, style }: { onPress?: () => void; style?: ViewStyle }) {
  return <Pressable style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }, style]} onPress={onPress} />;
}

function DrawerContent({ side = 'bottom', children, style }: { side?: 'top' | 'right' | 'bottom' | 'left'; children?: React.ReactNode; style?: ViewStyle }) {
  const ctx = React.useContext(DrawerCtx);
  const justify = side === 'bottom' ? 'flex-end' : side === 'top' ? 'flex-start' : 'center';
  const align = side === 'right' ? 'flex-end' : side === 'left' ? 'flex-start' : 'center';
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: justify, alignItems: align }} onPress={() => ctx?.setOpen(false)}>
        <View style={[{ backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '80%', width: '75%' }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function DrawerHeader({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16 }, style]}>{children}</View>;
}

function DrawerFooter({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ marginTop: 'auto', padding: 16 }, style]}>{children}</View>;
}

function DrawerTitle({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <Text style={[{ fontWeight: '600', fontSize: 16 }, style]}>{children}</Text>;
}

function DrawerDescription({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <Text style={[{ color: '#6B7280', fontSize: 12 }, style]}>{children}</Text>;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
