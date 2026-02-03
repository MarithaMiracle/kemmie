import React, { useEffect, useState } from "react";
import { Animated, View, Dimensions, StyleSheet, Easing } from "react-native";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  translateY: Animated.Value;
}

export function ConfettiAnimation() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    const colors = ["#FF6B9D", "#C44569", "#A84CB8", "#8E44AD", "#FFC312", "#FF6348"];
    const arr: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      const size = 6 + Math.floor(Math.random() * 6);
      arr.push({
        id: i,
        left: Math.random() * width,
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 1000,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        translateY: new Animated.Value(-20),
      });
    }

    setPieces(arr);

    const animations = arr.map((p) =>
      Animated.timing(p.translateY, {
        toValue: height + 40,
        duration: p.duration,
        delay: p.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    Animated.stagger(30, animations).start();
  }, []);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {pieces.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.piece,
            {
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateY: p.translateY }],
              left: p.left,
              top: -20,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 50,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  piece: {
    position: "absolute",
  },
});
