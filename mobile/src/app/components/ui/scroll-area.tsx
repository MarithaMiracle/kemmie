import * as React from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';

function ScrollArea({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  return (
    <ScrollView {...props} contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}

function ScrollBar() {
  return <View />;
}

export { ScrollArea, ScrollBar };
