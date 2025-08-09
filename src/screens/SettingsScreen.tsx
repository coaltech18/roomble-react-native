import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setNotificationsEnabled, toggleTheme } from '@/redux/slices/settingsSlice';
import { useTheme } from '@/theme/useTheme';

export const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { theme: currentTheme, notificationsEnabled } = useSelector(
    (s: RootState) => s.settings
  );
  const { colors, typography } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16, gap: 16 }}>
      <Text style={{ ...typography.heading }}>Settings</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.navy }}>Dark Theme</Text>
        <Switch
          value={currentTheme === 'dark'}
          onValueChange={() => {
            dispatch(toggleTheme());
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.navy }}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(v) => {
            dispatch(setNotificationsEnabled(v));
          }}
        />
      </View>
    </View>
  );
};


