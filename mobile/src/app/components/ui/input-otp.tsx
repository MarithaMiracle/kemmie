import * as React from "react";
import { View, Text, TextInput, ViewStyle, TextStyle, TextInputProps } from "react-native";

type InputOTPProps = {
  value?: string;
  onChange?: (v: string) => void;
  length?: number;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
};

type Slot = { char: string; isActive: boolean };
const OTPContext = React.createContext<{ slots: Slot[]; setChar: (i: number, c: string) => void } | null>(null);

function InputOTP({ value, onChange, length = 6, children, containerStyle }: InputOTPProps) {
  const [internal, setInternal] = React.useState<string>(value ?? "");
  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);
  const setChar = (i: number, c: string) => {
    const arr = internal.split("");
    arr[i] = c;
    const next = arr.join("").slice(0, length);
    if (value !== undefined) onChange?.(next);
    else setInternal(next);
  };
  const slots: Slot[] = Array.from({ length }, (_, i) => ({ char: internal[i] ?? "", isActive: false }));
  return <OTPContext.Provider value={{ slots, setChar }}><View style={[{ flexDirection: 'row', alignItems: 'center' }, containerStyle]}>{children}</View></OTPContext.Provider>;
}

function InputOTPGroup({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

function InputOTPSlot({ index, style, ...props }: { index: number; style?: TextStyle } & TextInputProps) {
  const ctx = React.useContext(OTPContext);
  const char = ctx?.slots[index]?.char ?? "";
  return (
    <TextInput
      value={char}
      onChangeText={(t) => ctx?.setChar(index, t.slice(-1))}
      keyboardType="number-pad"
      maxLength={1}
      style={[{ height: 36, width: 36, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, textAlign: 'center' }, style]}
      placeholder=""
      {...props}
    />
  );
}

function InputOTPSeparator({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ marginHorizontal: 4 }, style]}>{typeof children === 'string' ? children : '-'}</Text>;
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
