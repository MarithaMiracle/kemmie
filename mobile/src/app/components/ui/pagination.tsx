import * as React from "react";
import { View, Pressable, Text } from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";

function Pagination({ children }: { children?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{children}</View>;
}

function PaginationContent({ children }: { children?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{children}</View>;
}

function PaginationItem({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function PaginationLink({ isActive, onPress, children }: { isActive?: boolean; onPress?: () => void; children?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={{ height: 36, minWidth: 36, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: isActive ? 1 : 0, borderColor: '#E5E7EB', backgroundColor: isActive ? '#FFFFFF' : 'transparent' }}>
      {typeof children === 'string' ? <Text style={{ fontSize: 14 }}>{children}</Text> : children}
    </Pressable>
  );
}

function PaginationPrevious({ onPress }: { onPress?: () => void }) {
  return (
    <PaginationLink onPress={onPress}>
      <ChevronLeft size={16} />
      <Text style={{ marginLeft: 6 }}>Previous</Text>
    </PaginationLink>
  );
}

function PaginationNext({ onPress }: { onPress?: () => void }) {
  return (
    <PaginationLink onPress={onPress}>
      <Text style={{ marginRight: 6 }}>Next</Text>
      <ChevronRight size={16} />
    </PaginationLink>
  );
}

function PaginationEllipsis() {
  return (
    <View style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
      <MoreHorizontal size={16} />
    </View>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
