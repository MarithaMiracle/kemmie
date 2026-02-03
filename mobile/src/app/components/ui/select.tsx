import * as React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

type SelectContextType = { open: boolean; setOpen: (v: boolean) => void; value?: string; setValue?: (v: string) => void };
const SelectContext = React.createContext<SelectContextType | null>(null);

function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode }) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const controlled = value !== undefined;
  const current = controlled ? value : internalValue;
  const setValue = (v: string) => (controlled ? onValueChange?.(v) : setInternalValue(v));
  return (
    <SelectContext.Provider value={{ open, setOpen, value: current, setValue }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectGroup({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function SelectValue({ placeholder = 'Select…' }: { placeholder?: string }) {
  const ctx = React.useContext<SelectContextType | null>(SelectContext);
  return <Text>{ctx?.value ?? placeholder}</Text>;
}

function SelectTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext<SelectContextType | null>(SelectContext);
  return (
    <Pressable onPress={() => ctx?.setOpen(true)} style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {children}
      <Text style={{ color: '#9CA3AF' }}>▾</Text>
    </Pressable>
  );
}

function SelectContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext<SelectContextType | null>(SelectContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 24 }} onPress={() => ctx?.setOpen(false)}>
        <View style={{ borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function SelectLabel({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 12, color: '#6B7280', paddingHorizontal: 8, paddingVertical: 6 }}>{children}</Text>;
}

function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext<SelectContextType | null>(SelectContext);
  const selected = ctx?.value === value;
  const choose = () => {
    ctx?.setValue?.(value);
    ctx?.setOpen(false);
  };
  return (
    <Pressable onPress={choose} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
      {selected ? <Text>✓</Text> : null}
    </Pressable>
  );
}

function SelectSeparator() {
  return <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />;
}

function SelectScrollUpButton() {
  return <View />;
}

function SelectScrollDownButton() {
  return <View />;
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
