import * as React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function Checkbox({ checked = false, onCheckedChange, disabled, style }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      style={[
        {
          width: 16,
          height: 16,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: checked ? '#8B5CF6' : '#F9FAFB',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {checked ? <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text> : null}
    </Pressable>
  );
}

export { Checkbox };
