import * as React from 'react';
import { View, ViewProps } from 'react-native';

function Separator({ orientation = 'horizontal', style, ...props }: ViewProps & { orientation?: 'horizontal' | 'vertical' }) {
  return <View {...props} style={[orientation === 'horizontal' ? { height: 1, width: '100%' } : { width: 1, height: '100%' }, { backgroundColor: '#E5E7EB' }, style]} />;
}

export { Separator };
