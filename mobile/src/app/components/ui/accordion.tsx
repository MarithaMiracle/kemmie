import * as React from 'react';
import { View, Pressable, Text } from 'react-native';

type Mode = 'single' | 'multiple';

type AccordionProps = {
  type?: Mode;
  value?: string | string[];
  onValueChange?: (v: string | string[]) => void;
  children?: React.ReactNode;
};

type AccordionItemProps = {
  value: string;
  children?: React.ReactNode;
};

const AccordionContext = React.createContext<{
  type: Mode;
  open: string[];
  setOpen: (next: string[]) => void;
}>({ type: 'single', open: [], setOpen: () => {} });

const AccordionItemContext = React.createContext<{ id: string } | null>(null);

function Accordion({ type = 'single', value, onValueChange, children }: AccordionProps) {
  const isControlled = value !== undefined;
  const [internalOpen, setInternalOpen] = React.useState<string[]>([]);
  const open = Array.isArray(value) ? value : value ? [value] : internalOpen;
  const setOpen = (next: string[]) => {
    if (isControlled) {
      onValueChange?.(type === 'single' ? (next[0] ?? '') : next);
    } else {
      setInternalOpen(next);
    }
  };
  return (
    <AccordionContext.Provider value={{ type, open, setOpen }}>
      <View>{children}</View>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ id: value }}>
      <View>{children}</View>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children }: { children?: React.ReactNode }) {
  const item = React.useContext(AccordionItemContext);
  const ctx = React.useContext(AccordionContext);
  const open = !!item && ctx.open.includes(item.id);
  const toggle = () => {
    if (!item) return;
    if (ctx.type === 'single') {
      ctx.setOpen(open ? [] : [item.id]);
    } else {
      ctx.setOpen(open ? ctx.open.filter((x) => x !== item.id) : [...ctx.open, item.id]);
    }
  };
  return (
    <Pressable onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
      {typeof children === 'string' ? <Text style={{ fontSize: 14, fontWeight: '600' }}>{children}</Text> : children}
      <Text style={{ color: '#9CA3AF' }}>{open ? '▾' : '▸'}</Text>
    </Pressable>
  );
}

function AccordionContent({ children }: { children?: React.ReactNode }) {
  const item = React.useContext(AccordionItemContext);
  const ctx = React.useContext(AccordionContext);
  const open = !!item && ctx.open.includes(item.id);
  if (!open) return null;
  return <View style={{ paddingVertical: 8 }}>{children}</View>;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
