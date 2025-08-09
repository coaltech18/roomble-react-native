import { http } from './httpClient';

export async function verifyOtp(params: { phone: string; otp: string }): Promise<{
  userId: string;
  token: string;
}> {
  const { data } = await http.post('/api/auth/verify-otp', params);
  return data;
}


