import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/theme/useTheme';
import { calculateProfileCompleteness } from '@/utils/profile';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const profile = useSelector((s: RootState) => s.profile.profile);
  const navigation = useNavigation<any>();
  const { colors, typography } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ ...typography.heading }}>My Profile</Text>
      {profile ? (
        <>
          <Text style={{ marginTop: 8, color: colors.navy, fontSize: 18, fontWeight: '600' }}>{profile.name}</Text>
          <Text style={{ color: colors.textSecondary }}>{profile.occupation}</Text>
          <View style={{ marginTop: 12, backgroundColor: colors.surface, padding: 12, borderRadius: 10 }}>
            <Text style={{ color: colors.navy, fontWeight: '700' }}>Profile completeness</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View style={{ flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 }}>
                <View 
                  style={{ 
                    width: `${calculateProfileCompleteness(profile)}%`, 
                    height: '100%', 
                    backgroundColor: colors.primary, 
                    borderRadius: 4 
                  }} 
                />
              </View>
              <Text style={{ color: colors.textSecondary, marginLeft: 8, fontSize: 12 }}>
                {calculateProfileCompleteness(profile)}%
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Complete your profile from settings
        </Text>
      )}

      <TouchableOpacity
        style={{
          marginTop: 16,
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 10,
          alignItems: 'center'
        }}
        accessibilityRole="button"
        accessibilityLabel="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Edit Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 12,
          backgroundColor: colors.surface,
          padding: 12,
          borderRadius: 10,
          alignItems: 'center'
        }}
        accessibilityRole="button"
        accessibilityLabel="Open Settings"
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={{ color: colors.navy, fontWeight: '700' }}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};


