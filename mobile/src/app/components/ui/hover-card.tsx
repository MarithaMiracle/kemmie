import * as React from 'react';
import { Modal, View, Pressable, ViewStyle } from 'react-native';

type HoverCardContextType = { open: boolean; setOpen: (v: boolean) => void };
const HoverCardContext = React.createContext<HoverCardContextType | null>(null);

function HoverCard({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <HoverCardContext.Provider value={{ open, setOpen }}>{children}</HoverCardContext.Provider>;
}

function HoverCardTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(HoverCardContext);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function HoverCardContent({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  const ctx = React.useContext(HoverCardContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => ctx?.setOpen(false)}>
        <View style={[{ margin: 24, padding: 12, backgroundColor: '#fff', borderRadius: 8 }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
