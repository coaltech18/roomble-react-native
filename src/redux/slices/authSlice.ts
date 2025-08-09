import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  userId?: string;
  accessToken?: string;
  phone?: string;
};

const initialState: AuthState = {
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ userId: string; accessToken: string; phone: string }>
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.phone = action.payload.phone;
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
      state.userId = undefined;
      state.accessToken = undefined;
      state.phone = undefined;
    }
  }
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;


