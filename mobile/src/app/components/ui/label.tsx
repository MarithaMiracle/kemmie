import * as React from 'react';
import { Text, TextProps } from 'react-native';

function Label(props: TextProps) {
  return <Text {...props} style={[{ fontSize: 14, fontWeight: '600' }, props.style]} />;
}

export { Label };
