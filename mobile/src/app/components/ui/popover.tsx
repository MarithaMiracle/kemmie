import * as React from 'react';
import { Modal, View, Pressable, ViewStyle } from 'react-native';

type PopoverProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

type PopoverContentProps = {
  style?: ViewStyle;
  children?: React.ReactNode;
};

const PopoverContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Popover({ open, onOpenChange, children }: PopoverProps) {
  const [internal, setInternal] = React.useState(false);
  const isControlled = open !== undefined;
  const value = isControlled ? !!open : internal;
  const setValue = (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternal(v));
  return <PopoverContext.Provider value={{ open: value, setOpen: setValue }}>{children}</PopoverContext.Provider>;
}

function PopoverTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(PopoverContext);
  return <Pressable onPress={() => ctx?.setOpen(!ctx.open)}>{children}</Pressable>;
}

function PopoverContent({ children, style }: PopoverContentProps) {
  const ctx = React.useContext(PopoverContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }} onPress={() => ctx?.setOpen(false)}>
        <View style={[{ margin: 24, padding: 12, backgroundColor: '#fff', borderRadius: 8 }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

function PopoverAnchor(props: any) {
  return <View {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
