import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { StatusBar } from 'expo-status-bar';

import { AuthScreen } from '@/screens/AuthScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { RegistrationScreen } from '@/screens/RegistrationScreen';
import { MatchScreen } from '@/screens/MatchScreen';
import { ChatListScreen } from '@/screens/ChatListScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { FiltersScreen } from '@/screens/FiltersScreen';
import { SafetyScreen } from '@/screens/SafetyScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.background, borderTopColor: theme.colors.surface },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'Match' ? 'heart' : route.name === 'Chats' ? 'chatbubbles' : route.name === 'Profile' ? 'person' : 'settings';
          return <Ionicons name={name as any} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Filters" component={FiltersScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const theme = useTheme();
  // In a real app, select auth state and branch the navigator
  // const isAuthed = useSelector((s: RootState) => s.auth.isAuthenticated);
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      primary: theme.colors.primary,
      card: theme.colors.surface,
      text: theme.colors.navy,
      border: theme.colors.surface
    }
  } as const;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="App" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="App" component={AppTabs} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


