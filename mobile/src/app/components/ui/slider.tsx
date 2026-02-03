import * as React from 'react';
import { View, ViewStyle, GestureResponderEvent } from 'react-native';

interface SliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  rangeStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
}

function Slider({ value = 0, onValueChange, min = 0, max = 100, disabled, style, trackStyle, rangeStyle, thumbStyle }: SliderProps) {
  const [width, setWidth] = React.useState(0);
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min || 1);
  const handleMove = (evt: GestureResponderEvent) => {
    if (disabled || width <= 0) return;
    const x = evt.nativeEvent.locationX;
    const nextRatio = Math.max(0, Math.min(1, x / width));
    const next = min + nextRatio * (max - min);
    onValueChange?.(Math.round(next));
  };
  return (
    <View
      style={[{ height: 16, justifyContent: 'center' }, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => !disabled}
      onResponderMove={handleMove}
      onResponderGrant={handleMove}
    >
      <View style={[{ height: 4, borderRadius: 999, backgroundColor: '#E5E7EB' }, trackStyle]} />
      <View style={{ position: 'absolute', left: 0, right: 0, height: 16, justifyContent: 'center' }}>
        <View style={[{ height: 4, width: `${ratio * 100}%`, borderRadius: 999, backgroundColor: '#8B5CF6' }, rangeStyle]} />
        <View style={[{ position: 'absolute', left: `${ratio * 100}%`, marginLeft: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' }, thumbStyle]} />
      </View>
    </View>
  );
}

export { Slider };
