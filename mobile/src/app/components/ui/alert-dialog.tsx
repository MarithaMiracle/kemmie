import * as React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

type AlertDialogProps = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode };

const AlertDialogContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <AlertDialogContext.Provider value={{ open: value, setOpen: setValue }}>{children}</AlertDialogContext.Provider>;
}

function AlertDialogTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay({ onPress }: { onPress?: () => void }) {
  return <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onPress} />;
}

function AlertDialogContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AlertDialogOverlay onPress={() => ctx?.setOpen(false)} />
        <View style={{ maxWidth: '90%', borderRadius: 12, backgroundColor: '#fff', padding: 16 }}>{children}</View>
      </View>
    </Modal>
  );
}

function AlertDialogHeader({ children }: { children?: React.ReactNode }) {
  return <View style={{ marginBottom: 8 }}>{children}</View>;
}

function AlertDialogFooter({ children }: { children?: React.ReactNode }) {
  return <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>{children}</View>;
}

function AlertDialogTitle({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 18, fontWeight: '700' }}>{children}</Text>;
}

function AlertDialogDescription({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: '#6B7280' }}>{children}</Text>;
}

function AlertDialogAction({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#8B5CF6', marginLeft: 8 }}>
      {typeof children === 'string' ? <Text style={{ color: '#fff', fontWeight: '600' }}>{children}</Text> : children}
    </Pressable>
  );
}

function AlertDialogCancel({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <Pressable onPress={() => ctx?.setOpen(false)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel };
