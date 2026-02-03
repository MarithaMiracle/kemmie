import * as React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface AlertProps {
  variant?: 'default' | 'destructive';
  style?: ViewStyle;
  children?: React.ReactNode;
}

function Alert({ variant = 'default', style, children }: AlertProps) {
  const base: ViewStyle = { borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' };
  const destructive: ViewStyle = { borderColor: '#EF4444' };
  return <View style={[base, variant === 'destructive' ? destructive : null, style]}>{children}</View>;
}

function AlertTitle({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontSize: 14, fontWeight: '600' }, style]}>{children}</Text>;
}

function AlertDescription({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontSize: 13, color: '#6B7280' }, style]}>{children}</Text>;
}

export { Alert, AlertTitle, AlertDescription };
