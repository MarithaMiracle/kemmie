import * as React from 'react';
import { View, ViewStyle } from 'react-native';

interface ProgressProps {
  value?: number;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

function Progress({ value = 0, style, trackStyle, indicatorStyle }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[{ height: 8, width: '100%', borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' }, trackStyle, style]}>
      <View style={[{ height: '100%', width: `${clamped}%`, backgroundColor: '#8B5CF6' }, indicatorStyle]} />
    </View>
  );
}

export { Progress };
