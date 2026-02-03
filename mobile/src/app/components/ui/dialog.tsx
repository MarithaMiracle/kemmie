import * as React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

type DialogProps = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode };

const DialogContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <DialogContext.Provider value={{ open: value, setOpen: setValue }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function DialogOverlay({ onPress }: { onPress?: () => void }) {
  return <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onPress} />;
}

function DialogContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <DialogOverlay onPress={() => ctx?.setOpen(false)} />
        <View style={{ maxWidth: '90%', borderRadius: 12, backgroundColor: '#fff', padding: 16 }}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function DialogClose({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  return <Pressable onPress={() => ctx?.setOpen(false)}>{children || <Text>Close</Text>}</Pressable>;
}

function DialogHeader({ children }: { children?: React.ReactNode }) {
  return <View style={{ marginBottom: 8 }}>{children}</View>;
}

function DialogFooter({ children }: { children?: React.ReactNode }) {
  return <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>{children}</View>;
}

function DialogTitle({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 18, fontWeight: '700' }}>{children}</Text>;
}

function DialogDescription({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: '#6B7280' }}>{children}</Text>;
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
