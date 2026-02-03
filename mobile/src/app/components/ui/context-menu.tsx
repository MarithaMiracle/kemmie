import * as React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

const ContextMenuCtx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
const ContextMenuRadioCtx = React.createContext<{ value?: string; onValueChange?: (v: string) => void } | null>(null);

function ContextMenu({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <ContextMenuCtx.Provider value={{ open: value, setOpen: setValue }}>{children}</ContextMenuCtx.Provider>;
}

function ContextMenuTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(ContextMenuCtx);
  return <Pressable onLongPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function ContextMenuGroup({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function ContextMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function ContextMenuRadioGroup({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode }) {
  return <ContextMenuRadioCtx.Provider value={{ value, onValueChange }}><View>{children}</View></ContextMenuRadioCtx.Provider>;
}

function ContextMenuSubTrigger({ inset, children, onPress }: { inset?: boolean; children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: inset ? 16 : 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      <Text style={{ marginLeft: 'auto' }}>›</Text>
    </Pressable>
  );
}

function ContextMenuSubContent({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function ContextMenuContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(ContextMenuCtx);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 16 }} onPress={() => ctx?.setOpen(false)}>
        <View style={{ borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function ContextMenuItem({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function ContextMenuCheckboxItem({ children, checked, onCheckedChange }: { children?: React.ReactNode; checked?: boolean; onCheckedChange?: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onCheckedChange?.(!checked)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {checked ? <Text>✓</Text> : null}
    </Pressable>
  );
}

function ContextMenuRadioItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(ContextMenuRadioCtx);
  const selected = ctx?.value === value;
  return (
    <Pressable onPress={() => ctx?.onValueChange?.(value)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {selected ? <Text>•</Text> : null}
    </Pressable>
  );
}

function ContextMenuLabel({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 12, color: '#6B7280', paddingHorizontal: 8, paddingVertical: 6 }}>{children}</Text>;
}

function ContextMenuSeparator() {
  return <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 }} />;
}

function ContextMenuShortcut({ children }: { children?: React.ReactNode }) {
  return <Text style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: 12 }}>{children}</Text>;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
