import * as React from 'react';
import { View, Pressable, Text, ViewStyle, TextStyle } from 'react-native';

function Breadcrumb({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={style}>{children}</View>;
}

function BreadcrumbList({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }, style]}>{children}</View>;
}

function BreadcrumbItem({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

function BreadcrumbLink({ onPress, children, style, textStyle }: { onPress?: () => void; children?: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle }) {
  return (
    <Pressable onPress={onPress} style={style}>
      {typeof children === 'string' ? <Text style={[{ color: '#374151' }, textStyle]}>{children}</Text> : children}
    </Pressable>
  );
}

function BreadcrumbPage({ children, style, textStyle }: { children?: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle }) {
  return (
    <View style={style}>
      {typeof children === 'string' ? <Text style={[{ color: '#111827', fontWeight: '600' }, textStyle]}>{children}</Text> : children}
    </View>
  );
}

function BreadcrumbSeparator({ children, style, textStyle }: { children?: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle }) {
  return <Text style={[{ color: '#9CA3AF', marginHorizontal: 4 }, textStyle]}>{typeof children === 'string' ? children : '›'}</Text>;
}

function BreadcrumbEllipsis({ style, textStyle }: { style?: ViewStyle; textStyle?: TextStyle }) {
  return <Text style={[{ color: '#9CA3AF', marginHorizontal: 4 }, textStyle]}>…</Text>;
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
