import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/theme/useTheme';
import { calculateProfileCompleteness, getProfileCompletenessDetails } from '@/utils/profile';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { updateStats, unlockAchievement, updateAchievementProgress } from '@/redux/slices/profileSlice';
import { clearSession } from '@/redux/slices/authSlice';
import { persistor } from '@/redux/store';
import { PageTransition } from '@/components/PageTransition';

// Helper function to format stats
const formatStatValue = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// Helper function to get stat color
const getStatColor = (index: number): string => {
  const colors = ['#2DD4BF', '#FB7185', '#10B981', '#F59E0B', '#8B5CF6'];
  return colors[index % colors.length];
};

export const ProfileScreen = () => {
  const profile = useSelector((s: RootState) => s.profile.profile);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors, typography, shadows } = useTheme();
  
  const [selectedTab, setSelectedTab] = useState('overview');

  // Get real data from profile
  const achievements = profile?.achievements || [];
  const stats = profile?.stats ? [
    { label: 'Profile Views', value: formatStatValue(profile.stats.profileViews), icon: 'eye', color: getStatColor(0) },
    { label: 'Likes Received', value: formatStatValue(profile.stats.likesReceived), icon: 'heart', color: getStatColor(1) },
    { label: 'Conversations', value: formatStatValue(profile.stats.conversations), icon: 'chatbubbles', color: getStatColor(2) },
    { label: 'Days Active', value: formatStatValue(profile.stats.daysActive), icon: 'calendar', color: getStatColor(3) },
    { label: 'Matches Found', value: formatStatValue(profile.stats.matchesFound), icon: 'people', color: getStatColor(4) }
  ] : [];

  const handleTabPress = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const handleButtonPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          try {
            dispatch(clearSession());
            // Clear persisted store so token and user-specific state are removed
            persistor.purge();
            // No need to call navigation.reset; RootNavigator gates by isAuthed
          } catch {}
        }
      }
    ]);
  };

  const handleAchievementPress = (achievement: typeof achievements[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (achievement.unlocked) {
      Alert.alert(
        'Achievement Unlocked! 🎉',
        `${achievement.title}\n\n${achievement.description}`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Achievement Locked 🔒',
        `${achievement.title}\n\n${achievement.description}\n\nProgress: ${achievement.progress}%`,
        [{ text: 'Keep Going!', style: 'default' }]
      );
    }
  };

  const handleStatPress = (stat: typeof stats[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      stat.label,
      `Current value: ${stat.value}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleProfileCompletenessPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const details = getProfileCompletenessDetails(profile || {});
    
    let message = `Profile Completeness: ${details.score}%\n\n`;
    if (details.missing.length > 0) {
      message += `Missing:\n${details.missing.map(item => `• ${item}`).join('\n')}`;
    } else {
      message += '🎉 Your profile is complete!';
    }
    
    Alert.alert('Profile Completeness', message, [{ text: 'OK', style: 'default' }]);
  };

  // Demo function to simulate progress updates
  const simulateProgress = () => {
    // Simulate conversation progress
    const socialButterfly = achievements.find(a => a.id === '3');
    if (socialButterfly && !socialButterfly.unlocked) {
      const newProgress = Math.min(socialButterfly.progress + 20, 100);
      dispatch(updateAchievementProgress({ id: '3', progress: newProgress }));
      
      if (newProgress === 100) {
        Alert.alert('Achievement Unlocked! 🎉', 'Social Butterfly - You started 10 conversations!');
      }
    }
  };

  const renderAchievement = (achievement: typeof achievements[0]) => (
    <TouchableOpacity
      key={achievement.id}
      onPress={() => handleAchievementPress(achievement)}
      style={{
        backgroundColor: achievement.unlocked ? colors.primary + '20' : colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: achievement.unlocked ? 1 : 0.6,
        transform: [{ scale: achievement.unlocked ? 1 : 0.95 }]
      }}
    >
      <LinearGradient
        colors={achievement.unlocked ? [colors.primary, colors.coral] : [colors.surface, colors.surface]}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16
        }}
      >
        <Ionicons 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.unlocked ? '#fff' : colors.textSecondary} 
        />
      </LinearGradient>
      
      <View style={{ flex: 1 }}>
        <Text style={{ 
          color: colors.navy, 
          fontWeight: '700', 
          fontSize: 16,
          marginBottom: 4
        }}>
          {achievement.title}
        </Text>
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: 14,
          marginBottom: 8
        }}>
          {achievement.description}
        </Text>
        
        {/* Progress bar */}
        <View style={{ 
          height: 4, 
          backgroundColor: colors.surface, 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <LinearGradient
            colors={[colors.primary, colors.coral]}
            style={{
              width: `${achievement.progress}%`,
              height: '100%',
              borderRadius: 2
            }}
          />
        </View>
      </View>
      
      {achievement.unlocked && (
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      )}
    </TouchableOpacity>
  );

  const renderStatCard = (stat: typeof stats[0]) => (
    <TouchableOpacity
      key={stat.label}
      onPress={() => handleStatPress(stat)}
      style={{
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        flex: 1,
        margin: 4,
        ...shadows.card
      }}
    >
      <View style={{
        backgroundColor: stat.color + '20',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8
      }}>
        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      </View>
      <Text style={{ 
        color: colors.navy, 
        fontWeight: '800', 
        fontSize: 24,
        marginBottom: 4
      }}>
        {stat.value}
      </Text>
      <Text style={{ 
        color: colors.textSecondary, 
        fontSize: 12,
        textAlign: 'center'
      }}>
        {stat.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <PageTransition>
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={{
            paddingTop: 50,
            paddingBottom: 30,
            paddingHorizontal: 20
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            {/* Profile Avatar */}
            <LinearGradient
              colors={[colors.primary, colors.coral]}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                ...shadows.card
              }}
            >
              <Text style={{ 
                color: '#fff', 
                fontSize: 36, 
                fontWeight: '700' 
              }}>
                {profile?.name?.charAt(0) || 'U'}
              </Text>
            </LinearGradient>

            {/* Profile Info */}
            <Text style={[typography.heading, { 
              fontSize: 28,
              color: colors.navy,
              marginBottom: 4
            }]}>
              {profile?.name || 'Complete Your Profile'}
            </Text>
            
            <Text style={{ 
              color: colors.textSecondary, 
              fontSize: 16,
              marginBottom: 16
            }}>
              {profile?.occupation || 'Add your occupation'}
            </Text>

            {/* Profile Completeness */}
            <TouchableOpacity
              onPress={handleProfileCompletenessPress}
              style={{
                backgroundColor: colors.background,
                padding: 16,
                borderRadius: 16,
                width: '100%',
                ...shadows.card
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: colors.navy, fontWeight: '700' }}>
                  Profile Completeness
                </Text>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  {profile ? calculateProfileCompleteness(profile) : 0}%
                </Text>
              </View>
              
              <View style={{ 
                height: 8, 
                backgroundColor: colors.surface, 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <LinearGradient
                  colors={[colors.primary, colors.coral]}
                  style={{ 
                    width: `${profile ? calculateProfileCompleteness(profile) : 0}%`,
                    height: '100%', 
                    borderRadius: 4 
                  }} 
                />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginBottom: 20
        }}>
          {['overview', 'achievements', 'stats'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: 2,
                borderBottomColor: selectedTab === tab ? colors.primary : 'transparent'
              }}
            >
              <Text style={{
                color: selectedTab === tab ? colors.primary : colors.textSecondary,
                fontWeight: selectedTab === tab ? '700' : '500',
                textTransform: 'capitalize'
              }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
            </View>

        {/* Content */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'overview' && (
            <View>
              {/* Stats Grid */}
              <View style={{ 
                flexDirection: 'row', 
                marginBottom: 24,
                flexWrap: 'wrap'
              }}>
                {stats.map(renderStatCard)}
          </View>

              {/* Action Buttons */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginBottom: 12,
                  ...shadows.card
                }}
                onPress={() => handleButtonPress(() => navigation.navigate('EditProfile'))}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                  ✏️ Edit Profile
                </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginBottom: 12,
                  ...shadows.card
                }}
                onPress={() => handleButtonPress(() => navigation.navigate('Settings'))}
              >
                <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 16 }}>
                  ⚙️ Settings
                </Text>
              </TouchableOpacity>

              {/* Sign Out */}
              <TouchableOpacity
                style={{
          backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginBottom: 12,
                  ...shadows.card
                }}
                onPress={handleSignOut}
              >
                <Text style={{ color: colors.coral, fontWeight: '700', fontSize: 16 }}>
                  🚪 Sign Out
                </Text>
              </TouchableOpacity>

              {/* Demo Progress Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.coral,
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginBottom: 12,
                  ...shadows.card
                }}
                onPress={() => handleButtonPress(simulateProgress)}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                  🚀 Simulate Progress
                </Text>
      </TouchableOpacity>
            </View>
          )}

          {selectedTab === 'achievements' && (
            <View>
              <Text style={[typography.heading, { 
                fontSize: 20,
                marginBottom: 16,
                color: colors.navy
              }]}>
                Your Achievements
              </Text>
              {achievements.map(renderAchievement)}
            </View>
          )}

          {selectedTab === 'stats' && (
            <View>
              <Text style={[typography.heading, { 
                fontSize: 20,
                marginBottom: 16,
                color: colors.navy
              }]}>
                Detailed Statistics
              </Text>
              
              {/* Enhanced Stats */}
              <View style={{
                backgroundColor: colors.background,
                padding: 20,
                borderRadius: 16,
                marginBottom: 16,
                ...shadows.card
              }}>
                <Text style={{ 
                  color: colors.navy, 
                  fontWeight: '700', 
                  fontSize: 18,
                  marginBottom: 12
                }}>
                  Activity Summary
                </Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Profile Views</Text>
                  <Text style={{ color: colors.navy, fontWeight: '600' }}>{profile?.stats?.profileViews || 0}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Likes Received</Text>
                  <Text style={{ color: colors.navy, fontWeight: '600' }}>{profile?.stats?.likesReceived || 0}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Conversations Started</Text>
                  <Text style={{ color: colors.navy, fontWeight: '600' }}>{profile?.stats?.conversations || 0}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Days Active</Text>
                  <Text style={{ color: colors.navy, fontWeight: '600' }}>{profile?.stats?.daysActive || 0}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Matches Found</Text>
                  <Text style={{ color: colors.navy, fontWeight: '600' }}>{profile?.stats?.matchesFound || 0}</Text>
                </View>

                <View style={{ 
                  backgroundColor: colors.primary + '10', 
                  padding: 12, 
                  borderRadius: 8, 
                  marginTop: 12 
                }}>
                  <Text style={{ 
                    color: colors.primary, 
                    fontSize: 12, 
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    Last Active: {profile?.stats?.lastActive ? new Date(profile.stats.lastActive).toLocaleDateString() : 'Today'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </PageTransition>
    </View>
  );
};


