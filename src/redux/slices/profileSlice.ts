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
};

type ProfileState = {
  profile?: UserProfile;
};

const initialState: ProfileState = {};

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
    }
  }
});

export const { setProfile, updatePreferences } = profileSlice.actions;
export default profileSlice.reducer;


