import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SettingsState = {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
};

const initialState: SettingsState = {
  theme: 'light',
  notificationsEnabled: true
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    }
  }
});

export const { toggleTheme, setNotificationsEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;


