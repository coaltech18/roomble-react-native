import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  style,
  delay = 0,
  duration = 600
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, fadeAnim, slideAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
};
