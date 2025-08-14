import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { LoadingScreen } from './LoadingScreen';

interface AppLoadingProps {
  onLoadingComplete: () => void;
  loadingTime?: number;
}

export const AppLoading: React.FC<AppLoadingProps> = ({ 
  onLoadingComplete, 
  loadingTime = 2000 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out loading screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
        onLoadingComplete();
      });
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loadingTime, onLoadingComplete]);

  if (!isLoading) {
    return null;
  }

  return (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <LoadingScreen message="Loading Roomble..." />
    </Animated.View>
  );
};
