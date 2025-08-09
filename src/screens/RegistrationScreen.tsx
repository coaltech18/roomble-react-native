import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(18).max(65),
  gender: z.string().min(1),
  occupation: z.string().min(2)
});

export const RegistrationScreen = () => {
  const { colors, typography } = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [saving, setSaving] = useState(false);
  const { width } = useWindowDimensions();

  const onRegister = async () => {
    const result = schema.safeParse({ name, age, gender, occupation });
    if (!result.success) {
      Alert.alert('Invalid details', 'Please fill all fields correctly');
      return;
    }
    try {
      setSaving(true);
      // In production we would create the user profile after OTP.
      Alert.alert('Registered', 'Your basic details are saved. Continue onboarding.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to register');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 600, alignSelf: 'center', width: '100%' }}
    >
      <Text style={{ ...typography.heading }}>Create your account</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Age" keyboardType="number-pad" value={age} onChangeText={setAge}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Gender" value={gender} onChangeText={setGender}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Occupation" value={occupation} onChangeText={setOccupation}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />

      <TouchableOpacity onPress={onRegister} disabled={saving}
        style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Saving...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


