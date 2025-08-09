import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { useDispatch } from 'react-redux';
import { setSession } from '@/redux/slices/authSlice';
import { verifyOtp } from '@/services/authService';

export const AuthScreen = () => {
  const dispatch = useDispatch();
  const { colors, typography } = useTheme();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{4,6}$/.test(otp)) {
      Alert.alert('Invalid OTP', 'Enter the OTP sent to your phone');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ phone, otp });
      dispatch(setSession({ userId: res.userId, accessToken: res.token, phone }));
      // navigation to onboarding handled by parent navigator when auth state changes in real app
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message ?? 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20, gap: 12, maxWidth: 600, width: '100%', alignSelf: 'center' }}>
      <Text style={{ ...typography.heading }}>Welcome to Roomble</Text>
      <Text style={{ color: colors.textSecondary }}>Login with your phone number</Text>

      <TextInput
        placeholder="Phone number"
        keyboardType="number-pad"
        value={phone}
        onChangeText={setPhone}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}
      />
      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}
      />

      <TouchableOpacity
        onPress={onVerify}
        disabled={loading}
        style={{
          backgroundColor: colors.coral,
          padding: 14,
          borderRadius: 12,
          alignItems: 'center'
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: '700' }}>Verify & Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};


