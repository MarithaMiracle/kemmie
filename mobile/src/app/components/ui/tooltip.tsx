import * as React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

function TooltipProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const TooltipContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Tooltip({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>;
}

function TooltipTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(TooltipContext);
  return <Pressable onPressIn={() => ctx?.setOpen(true)} onPressOut={() => ctx?.setOpen(false)}>{children}</Pressable>;
}

function TooltipContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(TooltipContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#8B5CF6', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 }}>
          {typeof children === 'string' ? <Text style={{ color: '#fff', fontSize: 12 }}>{children}</Text> : children}
        </View>
      </View>
    </Modal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
