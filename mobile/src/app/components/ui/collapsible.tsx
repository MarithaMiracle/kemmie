import * as React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';

const CollapsibleCtx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

function Collapsible({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) {
  const [internal, setInternal] = React.useState(false);
  const controlled = open !== undefined;
  const value = controlled ? !!open : internal;
  const setValue = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternal(v));
  return <CollapsibleCtx.Provider value={{ open: value, setOpen: setValue }}>{children}</CollapsibleCtx.Provider>;
}

function CollapsibleTrigger({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleCtx);
  return <Pressable onPress={() => ctx?.setOpen(!ctx.open)}>{children}</Pressable>;
}

function CollapsibleContent({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  const ctx = React.useContext(CollapsibleCtx);
  if (!ctx?.open) return null;
  return <View style={style}>{children}</View>;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
