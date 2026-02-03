import * as React from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

function Command({ children }: { children?: React.ReactNode }) {
  return <View style={{ backgroundColor: '#FFFFFF' }}>{children}</View>;
}

function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, ...props }: React.ComponentProps<typeof Dialog> & { title?: string; description?: string }) {
  return (
    <Dialog {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ value, onChangeText, placeholder }: { value?: string; onChangeText?: (text: string) => void; placeholder?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, height: 48 }}>
      <Text style={{ color: '#9CA3AF', marginRight: 8 }}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ flex: 1, height: 40 }}
      />
    </View>
  );
}

function CommandList({ children }: { children?: React.ReactNode }) {
  return <ScrollView style={{ maxHeight: 300 }}>{children}</ScrollView>;
}

function CommandEmpty({ children }: { children?: React.ReactNode }) {
  return <Text style={{ paddingVertical: 12, textAlign: 'center', fontSize: 14 }}>{children}</Text>;
}

function CommandGroup({ children }: { children?: React.ReactNode }) {
  return <View style={{ padding: 4 }}>{children}</View>;
}

function CommandSeparator() {
  return <View style={{ height: 1, backgroundColor: '#E5E7EB', marginHorizontal: -4 }} />;
}

function CommandItem({ onSelect, children }: { onSelect?: () => void; children?: React.ReactNode }) {
  return (
    <Pressable onPress={onSelect} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
      {typeof children === 'string' ? <Text style={{ fontSize: 14 }}>{children}</Text> : children}
    </Pressable>
  );
}

function CommandShortcut({ children }: { children?: React.ReactNode }) {
  return <Text style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: 12 }}>{children}</Text>;
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
