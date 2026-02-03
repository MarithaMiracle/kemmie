import * as React from "react";
import { View, Text, ScrollView } from "react-native";

function Table({ children }: { children?: React.ReactNode }) {
  return (
    <ScrollView horizontal style={{ width: '100%' }}>
      <View style={{ minWidth: '100%' }}>{children}</View>
    </ScrollView>
  );
}

function TableHeader({ children }: { children?: React.ReactNode }) {
  return <View style={{ borderBottomWidth: 1, borderColor: '#E5E7EB' }}>{children}</View>;
}

function TableBody({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function TableFooter({ children }: { children?: React.ReactNode }) {
  return <View style={{ borderTopWidth: 1, borderColor: '#E5E7EB' }}>{children}</View>;
}

function TableRow({ children }: { children?: React.ReactNode }) {
  return <View style={{ borderBottomWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row' }}>{children}</View>;
}

function TableHead({ children }: { children?: React.ReactNode }) {
  return <Text style={{ height: 40, paddingHorizontal: 8, textAlign: 'left', fontWeight: '600' }}>{children}</Text>;
}

function TableCell({ children }: { children?: React.ReactNode }) {
  return <Text style={{ padding: 8 }}>{children}</Text>;
}

function TableCaption({ children }: { children?: React.ReactNode }) {
  return <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 12 }}>{children}</Text>;
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
