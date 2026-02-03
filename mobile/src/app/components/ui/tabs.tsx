import * as React from 'react';
import { View, Pressable, Text, ViewStyle } from 'react-native';

type TabsContextType = { value?: string; onValueChange?: (v: string) => void };
const TabsContext = React.createContext<TabsContextType>({});

function Tabs({ value, onValueChange, children, style }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode; style?: ViewStyle }) {
  return <TabsContext.Provider value={{ value, onValueChange }}><View style={style}>{children}</View></TabsContext.Provider>;
}

function TabsList({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row' }, style]}>{children}</View>;
}

function TabsTrigger({ value, children, style }: { value: string; children?: React.ReactNode; style?: ViewStyle }) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <Pressable onPress={() => ctx.onValueChange?.(value)} style={[{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12, backgroundColor: active ? '#FFFFFF' : '#F3F4F6', borderWidth: active ? 1 : 0, borderColor: '#E5E7EB', marginRight: 6 }, style]}>
      {typeof children === 'string' ? <Text style={{ color: active ? '#111827' : '#6B7280', fontWeight: '600' }}>{children}</Text> : children}
    </Pressable>
  );
}

function TabsContent({ value, children, style }: { value: string; children?: React.ReactNode; style?: ViewStyle }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <View style={style}>{children}</View>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
