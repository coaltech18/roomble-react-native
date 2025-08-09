import axios from 'axios';

export const http = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL });

http.interceptors.request.use((config) => {
  // attach auth header when available
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);


