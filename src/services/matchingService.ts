import { http } from './httpClient';
import { FilterCriteria } from '@/redux/slices/filtersSlice';

export async function fetchPotentialMatches(appliedFilters?: FilterCriteria) {
  const params = appliedFilters ? { filters: JSON.stringify(appliedFilters) } : {};
  const { data } = await http.get('/api/users/potential-matches', { params });
  return data as any[];
}

export async function sendSwipe(payload: { targetUserId: string; action: 'like' | 'nope' | 'super' }) {
  const { data } = await http.post('/api/matches/swipe', payload);
  return data;
}


