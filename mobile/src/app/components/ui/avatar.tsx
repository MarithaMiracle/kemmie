import * as React from 'react';
import { View, Image, ImageProps, Text, ViewStyle, TextStyle } from 'react-native';

const AvatarContext = React.createContext<{ failed: boolean; setFailed: (v: boolean) => void }>({ failed: false, setFailed: () => {} });

function Avatar({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <AvatarContext.Provider value={{ failed, setFailed }}>
      <View style={[{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }, style]}>
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

function AvatarImage(props: ImageProps) {
  const ctx = React.useContext(AvatarContext);
  if (ctx.failed) return null;
  return <Image {...props} style={[{ width: '100%', height: '100%' }, props.style]} onError={() => ctx.setFailed(true)} />;
}

function AvatarFallback({ children, style, textStyle }: { children?: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle }) {
  const ctx = React.useContext(AvatarContext);
  if (!ctx.failed) return null;
  return (
    <View style={[{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }, style]}>
      {typeof children === 'string' ? <Text style={[{ color: '#6B7280' }, textStyle]}>{children}</Text> : children}
    </View>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
