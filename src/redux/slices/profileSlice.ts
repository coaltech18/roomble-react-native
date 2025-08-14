import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PreferencesData = {
  budgetRange: [number, number];
  preferredAreas: string[];
  lifestyle: string;
  dealBreakers: string[];
  maxDistance: number;
  ageRange: [number, number];
  occupationPreferences: string[];
  vegetarianPreference: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  unlockedAt?: string;
};

export type UserStats = {
  profileViews: number;
  likesReceived: number;
  conversations: number;
  daysActive: number;
  matchesFound: number;
  lastActive: string;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  role: 'has_room' | 'seeking_room';
  photoUrls: string[];
  bio: string;
  location: { lat: number; lng: number };
  preferences: PreferencesData;
  verification: { idUploaded: boolean; workVerified: boolean };
  createdAt: string;
  isActive: boolean;
  achievements: Achievement[];
  stats: UserStats;
};

type ProfileState = {
  profile?: UserProfile;
};

const initialState: ProfileState = {
  profile: {
    id: '1',
    name: 'John Doe',
    age: 25,
    gender: 'Male',
    occupation: 'Software Engineer',
    role: 'seeking_room',
    photoUrls: [],
    bio: 'Looking for a compatible roommate in Bangalore',
    location: { lat: 12.9716, lng: 77.5946 },
    preferences: {
      budgetRange: [15000, 30000],
      preferredAreas: ['Koramangala', 'HSR Layout'],
      lifestyle: 'Professional',
      dealBreakers: ['Smoking'],
      maxDistance: 10,
      ageRange: [22, 30],
      occupationPreferences: ['Tech', 'Finance'],
      vegetarianPreference: true
    },
    verification: { idUploaded: true, workVerified: true },
    createdAt: new Date().toISOString(),
    isActive: true,
    achievements: [
      { id: '1', title: 'Profile Pioneer', description: 'Complete your profile', icon: 'person-circle', unlocked: true, progress: 100, unlockedAt: new Date().toISOString() },
      { id: '2', title: 'Verification Master', description: 'Get both ID and work verified', icon: 'shield-checkmark', unlocked: true, progress: 100, unlockedAt: new Date().toISOString() },
      { id: '3', title: 'Social Butterfly', description: 'Start 10 conversations', icon: 'chatbubbles', unlocked: false, progress: 60 },
      { id: '4', title: 'Perfect Match', description: 'Find your ideal roommate', icon: 'heart', unlocked: false, progress: 0 },
      { id: '5', title: 'Safety First', description: 'Use safety features', icon: 'shield', unlocked: false, progress: 0 }
    ],
    stats: {
      profileViews: 47,
      likesReceived: 23,
      conversations: 8,
      daysActive: 12,
      matchesFound: 3,
      lastActive: new Date().toISOString()
    }
  }
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<PreferencesData>>) => {
      if (state.profile) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload } as PreferencesData;
      }
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.profile) {
        state.profile.stats = { ...state.profile.stats, ...action.payload };
      }
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        const achievement = state.profile.achievements.find(a => a.id === action.payload);
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.progress = 100;
          achievement.unlockedAt = new Date().toISOString();
        }
      }
    },
    updateAchievementProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      if (state.profile) {
        const achievement = state.profile.achievements.find(a => a.id === action.payload.id);
        if (achievement) {
          achievement.progress = action.payload.progress;
          if (achievement.progress >= 100 && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
        }
      }
    }
  }
});

export const { setProfile, updatePreferences, updateStats, unlockAchievement, updateAchievementProgress } = profileSlice.actions;
export default profileSlice.reducer;


