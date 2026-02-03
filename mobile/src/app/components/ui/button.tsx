import * as React from 'react';
import { Pressable, Text, ViewStyle, TextStyle, StyleSheet, StyleProp } from 'react-native';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const variantStyles: Record<Variant, { container: ViewStyle; label: TextStyle }> = {
  default: { container: { backgroundColor: '#8B5CF6' }, label: { color: '#fff' } },
  destructive: { container: { backgroundColor: '#EF4444' }, label: { color: '#fff' } },
  outline: { container: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'transparent' }, label: { color: '#111827' } },
  secondary: { container: { backgroundColor: '#F3F4F6' }, label: { color: '#111827' } },
  ghost: { container: { backgroundColor: 'transparent' }, label: { color: '#111827' } },
  link: { container: { backgroundColor: 'transparent' }, label: { color: '#8B5CF6', textDecorationLine: 'underline' } },
};

const sizeStyles: Record<Size, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  sm: { height: 32, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  lg: { height: 40, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  icon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
};

function Button({ variant = 'default', size = 'default', disabled, onPress, children, style, textStyle }: ButtonProps) {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];
  return (
    <Pressable onPress={onPress} disabled={disabled} style={StyleSheet.flatten([ss, vs.container, style])}>
      {typeof children === 'string' ? <Text style={StyleSheet.flatten([{ fontSize: 14, fontWeight: '600' }, vs.label, textStyle])}>{children}</Text> : children}
    </Pressable>
  );
}

export { Button };
