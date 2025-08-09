import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, Share } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/theme/useTheme';

export const SafetyScreen = () => {
  const { colors, typography } = useTheme();
  const dialEmergency = async () => {
    try {
      await Linking.openURL('tel:112');
    } catch {
      Alert.alert('Error', 'Unable to open dialer');
    }
  };

  const shareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location access is needed to share your location');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      await Share.share({ message: `My live location: ${url}` });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not share location');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16, gap: 12 }}>
      <Text style={{ ...typography.heading }}>Safety Toolkit</Text>
      <TouchableOpacity onPress={dialEmergency} style={{ backgroundColor: colors.error, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Call Emergency (112)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={shareLocation} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Share My Location</Text>
      </TouchableOpacity>
      <View style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}>
        <Text style={{ color: colors.navy, fontWeight: '700', marginBottom: 6 }}>Tips</Text>
        <Text style={{ color: colors.textSecondary }}>
          Meet in public places first, verify identity, and share your meeting plan with a friend.
        </Text>
      </View>
    </View>
  );
};


