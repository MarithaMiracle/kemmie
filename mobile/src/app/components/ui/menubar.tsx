import * as React from 'react';
import { View, Pressable, Text, Modal } from 'react-native';

const MenubarMenuCtx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
const MenubarRadioCtx = React.createContext<{ value?: string; onValueChange?: (v: string) => void } | null>(null);

function Menubar({ children }: { children?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{children}</View>;
}

function MenubarMenu({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <MenubarMenuCtx.Provider value={{ open, setOpen }}>{children}</MenubarMenuCtx.Provider>;
}

function MenubarGroup({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function MenubarPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function MenubarRadioGroup({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode }) {
  return <MenubarRadioCtx.Provider value={{ value, onValueChange }}><View>{children}</View></MenubarRadioCtx.Provider>;
}

function MenubarTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(MenubarMenuCtx);
  return (
    <Pressable onPress={() => ctx?.setOpen(!ctx.open)} style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 }}>
      {typeof children === 'string' ? <Text style={{ fontWeight: '600' }}>{children}</Text> : children}
    </Pressable>
  );
}

function MenubarContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(MenubarMenuCtx);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 16 }} onPress={() => ctx?.setOpen(false)}>
        <View style={{ borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function MenubarItem({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function MenubarCheckboxItem({ children, checked, onCheckedChange }: { children?: React.ReactNode; checked?: boolean; onCheckedChange?: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onCheckedChange?.(!checked)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {checked ? <Text>✓</Text> : null}
    </Pressable>
  );
}

function MenubarRadioItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(MenubarRadioCtx);
  const selected = ctx?.value === value;
  return (
    <Pressable onPress={() => ctx?.onValueChange?.(value)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {selected ? <Text>•</Text> : null}
    </Pressable>
  );
}

function MenubarLabel({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 12, color: '#6B7280', paddingHorizontal: 8, paddingVertical: 6 }}>{children}</Text>;
}

function MenubarSeparator() {
  return <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 }} />;
}

function MenubarShortcut({ children }: { children?: React.ReactNode }) {
  return <Text style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: 12 }}>{children}</Text>;
}

function MenubarSub({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function MenubarSubTrigger({ children }: { children?: React.ReactNode }) {
  return <Pressable>{children}</Pressable>;
}

function MenubarSubContent({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
