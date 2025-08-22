import { http } from './httpClient';

export interface RegistrationData {
  phone: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
}

export interface AuthResponse {
  userId: string;
  token: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    age: number;
    gender: string;
    occupation: string;
  };
}

export async function registerUser(params: RegistrationData): Promise<AuthResponse> {
  const { data } = await http.post('/api/auth/register-phone', params);
  return data;
}

export async function sendOtp(params: { phone: string }): Promise<{ message: string }> {
  const { data } = await http.post('/api/auth/send-otp', params);
  return data;
}

export async function verifyOtp(params: { phone: string; otp: string }): Promise<AuthResponse> {
  const { data } = await http.post('/api/auth/verify-otp', params);
  return data;
}


