import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';

function Textarea(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      multiline
      style={[{ minHeight: 64, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#111827', textAlignVertical: 'top' }, props.style]}
      placeholderTextColor="#9CA3AF"
    />
  );
}

export { Textarea };
