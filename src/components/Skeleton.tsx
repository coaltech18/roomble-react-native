import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

type Props = { width?: number | string; height?: number; radius?: number; style?: any };

export const Skeleton: React.FC<Props> = ({ width = '100%', height = 16, radius = 8, style }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(shimmerValue, { toValue: 0, duration: 1000, useNativeDriver: false })
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const backgroundColor = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e5e7eb', '#f3f4f6']
  });

  return (
    <Animated.View
      accessibilityLabel="Loading content"
      style={{ width, height, backgroundColor, borderRadius: radius, ...style }}
    />
  );
};


