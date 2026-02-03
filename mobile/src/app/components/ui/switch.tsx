import * as React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';

interface Props extends Omit<SwitchProps, 'value' | 'onValueChange'> {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
}

function Switch({ checked = false, onCheckedChange, ...props }: Props) {
  return <RNSwitch value={checked} onValueChange={onCheckedChange} {...props} />;
}

export { Switch };
