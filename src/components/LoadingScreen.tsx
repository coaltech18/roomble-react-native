import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Finding your perfect match..." 
}) => {
  const { colors, typography } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        }}
      >
        {/* Logo/Icon */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
              marginBottom: 20,
            }}
          >
            <LinearGradient
              colors={[colors.primary, colors.coral]}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="home" size={40} color="#fff" />
            </LinearGradient>
          </Animated.View>

          <Text style={[typography.heading, { 
            fontSize: 28,
            color: colors.navy,
            marginBottom: 8,
            textAlign: 'center'
          }]}>
            Roomble
          </Text>
          
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 40
          }}>
            Find your perfect roommate
          </Text>
        </View>

        {/* Loading Message */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: colors.navy,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 20
          }}>
            {message}
          </Text>

          {/* Loading Dots */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginHorizontal: 4,
                  opacity: pulseAnim,
                }}
              />
            ))}
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={{
          position: 'absolute',
          top: height * 0.2,
          right: width * 0.1,
          opacity: 0.3
        }}>
          <Ionicons name="heart" size={24} color={colors.coral} />
        </View>

        <View style={{
          position: 'absolute',
          bottom: height * 0.2,
          left: width * 0.1,
          opacity: 0.3
        }}>
          <Ionicons name="people" size={24} color={colors.primary} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};
