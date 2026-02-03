import * as React from 'react';
import { View, Pressable, Text, ViewStyle } from 'react-native';

type RadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
};

type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
};

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

function RadioGroup({ value, onValueChange, children, style }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <View style={style}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({ value, disabled, children, style }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const selected = ctx.value === value;
  return (
    <Pressable
      onPress={() => ctx.onValueChange?.(value)}
      disabled={disabled}
      style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#9CA3AF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        {selected ? (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} />
        ) : null}
      </View>
      {typeof children === 'string' ? (
        <Text style={{ color: '#111827', fontSize: 14 }}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { RadioGroup, RadioGroupItem };
