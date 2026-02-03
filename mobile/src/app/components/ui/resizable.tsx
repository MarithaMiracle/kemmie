import * as React from "react";
import { View, Pressable } from "react-native";
import { GripVerticalIcon } from "lucide-react-native";

function ResizablePanelGroup(props: any) {
  const { children, style } = props || {};
  const direction = props?.direction ?? 'horizontal';
  return (
    <View style={[{ flex: 1, width: '100%', flexDirection: direction === 'vertical' ? 'column' : 'row' }, style]}>
      {children}
    </View>
  );
}

function ResizablePanel(props: any) {
  const { children, style } = props || {};
  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}

function ResizableHandle({ withHandle, style, onPress }: { withHandle?: boolean; style?: any; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[{ width: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB' }, style]}>
      {withHandle && (
        <View style={{ backgroundColor: '#E5E7EB', zIndex: 10, height: 16, width: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
          <GripVerticalIcon size={10} />
        </View>
      )}
    </Pressable>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
