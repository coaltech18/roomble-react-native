import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setProfile, PreferencesData, UserProfile } from '@/redux/slices/profileSlice';
import { updateProfile } from '@/services/profileService';

export const EditProfileScreen = () => {
  const { colors, typography } = useTheme();
  const current = useSelector((s: RootState) => s.profile.profile);
  const dispatch = useDispatch();
  const [name, setName] = useState(current?.name ?? '');
  const [occupation, setOccupation] = useState(current?.occupation ?? '');
  const [bio, setBio] = useState(current?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<'has_room' | 'seeking_room'>(current?.role ?? 'seeking_room');

  const onSave = async () => {
    if (!name.trim() || !occupation.trim()) {
      Alert.alert('Missing info', 'Name and occupation are required');
      return;
    }
    try {
      setSaving(true);
      await updateProfile({ name, occupation, bio });
      const updated: UserProfile = {
        ...(current ?? ({} as UserProfile)),
        id: current?.id ?? 'me',
        name,
        occupation,
        bio,
        role,
        age: current?.age ?? 25,
        gender: current?.gender ?? 'Prefer not to say',
        photoUrls: current?.photoUrls ?? [],
        location: current?.location ?? { lat: 12.9716, lng: 77.5946 },
        preferences:
          current?.preferences ??
          ({
            budgetRange: [10000, 30000],
            preferredAreas: [],
            lifestyle: 'Balanced',
            dealBreakers: [],
            maxDistance: 10,
            ageRange: [20, 35],
            occupationPreferences: [],
            vegetarianPreference: false
          } as PreferencesData),
        verification: current?.verification ?? { idUploaded: false, workVerified: false },
        createdAt: current?.createdAt ?? new Date().toISOString(),
        isActive: true
      };
      dispatch(setProfile(updated));
      Alert.alert('Saved', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 600, alignSelf: 'center', width: '100%' }}>
      <Text style={{ ...typography.heading }}>Edit Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}
      />
      <TextInput
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 10, minHeight: 100 }}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => setRole('seeking_room')}
          style={{
            backgroundColor: role === 'seeking_room' ? colors.primary : colors.surface,
            padding: 12,
            borderRadius: 10,
            flex: 1,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: role === 'seeking_room' ? '#fff' : colors.navy }}>Seeking Room</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole('has_room')}
          style={{
            backgroundColor: role === 'has_room' ? colors.primary : colors.surface,
            padding: 12,
            borderRadius: 10,
            flex: 1,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: role === 'has_room' ? '#fff' : colors.navy }}>Has Room</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        disabled={saving}
        onPress={onSave}
        style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


