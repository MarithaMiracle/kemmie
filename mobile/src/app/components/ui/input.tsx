import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';

function Input(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[{ height: 36, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, color: '#111827' }, props.style]}
      placeholderTextColor="#9CA3AF"
    />
  );
}

export { Input };
