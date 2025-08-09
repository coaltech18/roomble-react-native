import { http } from './httpClient';

export async function updateProfile(payload: any) {
  const { data } = await http.put('/api/profile/update', payload);
  return data;
}

export async function uploadPhoto(fileUri: string) {
  const form = new FormData();
  const file: any = { uri: fileUri, name: 'photo.jpg', type: 'image/jpeg' };
  // React Native's FormData file differs from DOM typings. Cast to any to satisfy TS.
  form.append('file', file);
  const { data } = await http.post('/api/profile/upload-photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data as { url: string };
}


