import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface NavigationTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isActive: boolean;
  duration?: number;
}

export const NavigationTransition: React.FC<NavigationTransitionProps> = ({
  children,
  style,
  isActive,
  duration = 300
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isActive) {
      // Animate in when becoming active
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
        })
      ]).start();
    } else {
      // Animate out when becoming inactive
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: duration / 2,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isActive, duration, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
};
