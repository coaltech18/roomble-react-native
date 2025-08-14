import axios from 'axios';
import { store } from '@/redux/store';

export const http = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL });

http.interceptors.request.use((config) => {
  // attach auth header when available
  try {
    const state: any = store.getState();
    const token: string | undefined = state?.auth?.accessToken;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);


