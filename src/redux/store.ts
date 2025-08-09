import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '@/redux/slices/authSlice';
import profileReducer from '@/redux/slices/profileSlice';
import settingsReducer from '@/redux/slices/settingsSlice';
import filtersReducer from '@/redux/slices/filtersSlice';
import matchingReducer from '@/redux/slices/matchingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  settings: settingsReducer,
  filters: filtersReducer,
  matching: matchingReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'profile', 'settings', 'filters', 'matching']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;


