import * as React from 'react';
import { View, ViewStyle } from 'react-native';

function Skeleton({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ backgroundColor: '#F3F4F6', borderRadius: 8 }, style]}>{children}</View>;
}

export { Skeleton };
