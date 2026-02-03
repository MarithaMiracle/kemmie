import * as React from "react";
import { Modal, View, Pressable, Text } from "react-native";

const DropdownMenuContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
function DropdownMenu({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <DropdownMenuContext.Provider value={{ open: value, setOpen: setValue }}>{children}</DropdownMenuContext.Provider>;
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function DropdownMenuContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 16 }} onPress={() => ctx?.setOpen(false)}>
        <View style={{ borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function DropdownMenuGroup({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function DropdownMenuItem({ children, inset, variant = "default", onPress }: { children?: React.ReactNode; inset?: boolean; variant?: "default" | "destructive"; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: inset ? 16 : 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function DropdownMenuCheckboxItem({ children, checked, onCheckedChange }: { children?: React.ReactNode; checked?: boolean; onCheckedChange?: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onCheckedChange?.(!checked)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {checked ? <Text>✓</Text> : null}
    </Pressable>
  );
}

const DropdownMenuRadioContext = React.createContext<{ value?: string; onValueChange?: (v: string) => void } | null>(null);
function DropdownMenuRadioGroup({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode }) {
  return <DropdownMenuRadioContext.Provider value={{ value, onValueChange }}><View>{children}</View></DropdownMenuRadioContext.Provider>;
}

function DropdownMenuRadioItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuRadioContext);
  const selected = ctx?.value === value;
  return (
    <Pressable onPress={() => ctx?.onValueChange?.(value)} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {selected ? <Text>•</Text> : null}
    </Pressable>
  );
}

function DropdownMenuLabel({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 12, color: '#6B7280', paddingHorizontal: 8, paddingVertical: 6 }}>{children}</Text>;
}

function DropdownMenuSeparator() {
  return <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 }} />;
}

function DropdownMenuShortcut({ children }: { children?: React.ReactNode }) {
  return <Text style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: 12 }}>{children}</Text>;
}

function DropdownMenuSub({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function DropdownMenuSubTrigger({ inset, children, onPress }: { inset?: boolean; children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: inset ? 16 : 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      <Text style={{ marginLeft: 'auto' }}>›</Text>
    </Pressable>
  );
}

function DropdownMenuSubContent({ children }: { children?: React.ReactNode }) {
  return <View style={{ borderRadius: 8, backgroundColor: '#fff' }}>{children}</View>;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
