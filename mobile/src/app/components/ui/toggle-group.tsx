import * as React from 'react';
import { View, Pressable, Text, ViewStyle } from 'react-native';

type Mode = 'single' | 'multiple';

interface ToggleGroupProps {
  type?: Mode;
  value?: string | string[];
  onValueChange?: (v: string | string[]) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

interface ToggleGroupItemProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ToggleGroupContext = React.createContext<{
  type: Mode;
  value?: string | string[];
  onValueChange?: (v: string | string[]) => void;
}>({ type: 'single' });

function ToggleGroup({ type = 'single', value, onValueChange, children, style }: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange }}>
      <View style={[{ flexDirection: 'row' }, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({ value, disabled, children, style }: ToggleGroupItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  const active = Array.isArray(ctx.value) ? ctx.value.includes(value) : ctx.value === value;
  const toggle = () => {
    if (disabled) return;
    if (ctx.type === 'single') {
      ctx.onValueChange?.(value);
    } else {
      const current = Array.isArray(ctx.value) ? ctx.value : [];
      const next = active ? current.filter((v) => v !== value) : [...current, value];
      ctx.onValueChange?.(next);
    }
  };
  return (
    <Pressable onPress={toggle} disabled={disabled} style={[{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: active ? '#E5E7EB' : 'transparent', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 4 }, style]}>
      {typeof children === 'string' ? <Text style={{ fontSize: 14 }}>{children}</Text> : children}
    </Pressable>
  );
}

export { ToggleGroup, ToggleGroupItem };
