import * as React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

function Toggle({ pressed = false, onPressedChange, disabled, style, textStyle, children, variant = 'default', size = 'default' }: ToggleProps) {
  const base: ViewStyle = { alignItems: 'center', justifyContent: 'center', borderRadius: 8 };
  const sizes: Record<'sm'|'default'|'lg', ViewStyle> = { sm: { height: 32, paddingHorizontal: 6, minWidth: 32 }, default: { height: 36, paddingHorizontal: 8, minWidth: 36 }, lg: { height: 40, paddingHorizontal: 10, minWidth: 40 } };
  const visual: ViewStyle = variant === 'outline' ? { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: pressed ? '#EEF2FF' : 'transparent' } : { backgroundColor: pressed ? '#E5E7EB' : 'transparent' };
  return (
    <Pressable disabled={disabled} onPress={() => onPressedChange?.(!pressed)} style={[base, sizes[size], visual, style]}>
      {typeof children === 'string' ? <Text style={[{ fontSize: 14 }, textStyle]}>{children}</Text> : children}
    </Pressable>
  );
}

export { Toggle };
