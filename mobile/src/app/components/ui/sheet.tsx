import * as React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

type Side = 'top' | 'right' | 'bottom' | 'left';

type SheetProps = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode };

type SheetContentProps = { side?: Side; children?: React.ReactNode };

const SheetContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <SheetContext.Provider value={{ open: value, setOpen: setValue }}>{children}</SheetContext.Provider>;
}

function SheetTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  return <Pressable onPress={() => ctx?.setOpen(true)}>{children}</Pressable>;
}

function SheetClose({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  return <Pressable onPress={() => ctx?.setOpen(false)}>{children || <Text>Close</Text>}</Pressable>;
}

function SheetPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SheetOverlay({ onPress }: { onPress?: () => void }) {
  return <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onPress} />;
}

function SheetContent({ side = 'right', children }: SheetContentProps) {
  const ctx = React.useContext(SheetContext);
  const container: any = { position: 'absolute', backgroundColor: '#fff', padding: 16 };
  if (side === 'right') Object.assign(container, { right: 0, top: 0, bottom: 0, width: '75%' });
  if (side === 'left') Object.assign(container, { left: 0, top: 0, bottom: 0, width: '75%' });
  if (side === 'top') Object.assign(container, { top: 0, left: 0, right: 0 });
  if (side === 'bottom') Object.assign(container, { bottom: 0, left: 0, right: 0 });
  return (
    <Modal transparent visible={!!ctx?.open} onRequestClose={() => ctx?.setOpen(false)}>
      <View style={{ flex: 1 }}>
        <SheetOverlay onPress={() => ctx?.setOpen(false)} />
        <View style={container}>{children}</View>
      </View>
    </Modal>
  );
}

function SheetHeader({ children }: { children?: React.ReactNode }) {
  return <View style={{ padding: 16 }}>{children}</View>;
}

function SheetFooter({ children }: { children?: React.ReactNode }) {
  return <View style={{ marginTop: 'auto', padding: 16 }}>{children}</View>;
}

function SheetTitle({ children }: { children?: React.ReactNode }) {
  return <Text style={{ fontWeight: '700' }}>{children}</Text>;
}

function SheetDescription({ children }: { children?: React.ReactNode }) {
  return <Text style={{ color: '#6B7280' }}>{children}</Text>;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
