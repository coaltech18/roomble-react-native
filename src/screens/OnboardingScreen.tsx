import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(18).max(65),
  gender: z.string().min(1),
  occupation: z.string().min(2)
});

export const OnboardingScreen = () => {
  const { colors, typography } = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');

  const onNext = () => {
    const result = schema.safeParse({ name, age, gender, occupation });
    if (!result.success) {
      Alert.alert('Invalid details', 'Please fill all fields correctly');
      return;
    }
    // proceed to photo upload screen (out of scope for initial scaffold)
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12, maxWidth: 600, alignSelf: 'center', width: '100%' }}
      style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ ...typography.heading }}>Tell us about you</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Age" keyboardType="number-pad" value={age} onChangeText={setAge}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Gender" value={gender} onChangeText={setGender}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder="Occupation" value={occupation} onChangeText={setOccupation}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }} />

      <TouchableOpacity onPress={onNext}
        style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


