import * as React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Badge({ variant = 'default', children, style, textStyle }: BadgeProps) {
  const base: ViewStyle = { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' };
  const variants: Record<string, { container: ViewStyle; label: TextStyle }> = {
    default: { container: { backgroundColor: '#8B5CF6' }, label: { color: '#fff' } },
    secondary: { container: { backgroundColor: '#F3F4F6' }, label: { color: '#111827' } },
    destructive: { container: { backgroundColor: '#EF4444' }, label: { color: '#fff' } },
    outline: { container: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'transparent' }, label: { color: '#111827' } },
  };
  const vs = variants[variant];
  return (
    <View style={[base, vs.container, style]}>
      {typeof children === 'string' ? <Text style={[{ fontSize: 12, fontWeight: '600' }, vs.label, textStyle]}>{children}</Text> : children}
    </View>
  );
}

export { Badge };
