import * as React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

function Card({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }, style]}>{children}</View>;
}

function CardHeader({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ paddingHorizontal: 24, paddingTop: 24 }, style]}>{children}</View>;
}

function CardTitle({ style, children }: { style?: TextStyle; children?: React.ReactNode }) {
  return <Text style={[{ fontSize: 16, fontWeight: '700' }, style]}>{children}</Text>;
}

function CardDescription({ style, children }: { style?: TextStyle; children?: React.ReactNode }) {
  return <Text style={[{ color: '#6B7280' }, style]}>{children}</Text>;
}

function CardAction({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ alignSelf: 'flex-end' }, style]}>{children}</View>;
}

function CardContent({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ paddingHorizontal: 24 }, style]}>{children}</View>;
}

function CardFooter({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={[{ paddingHorizontal: 24, paddingBottom: 24, flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
