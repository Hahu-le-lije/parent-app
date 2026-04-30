import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type InlineSkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
};

const InlineSkeleton = ({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: InlineSkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius, opacity },
        style as any,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#3A3A55",
  },
});

export default InlineSkeleton;
