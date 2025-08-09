import { createSlice } from '@reduxjs/toolkit';

type MatchingState = {
  superLikesRemaining: number;
  lastResetAt: string; // ISO
};

const DAILY_SUPER_LIKES = 5;

const initialState: MatchingState = {
  superLikesRemaining: DAILY_SUPER_LIKES,
  lastResetAt: new Date().toISOString()
};

function shouldReset(dateIso: string): boolean {
  const last = new Date(dateIso);
  const now = new Date();
  return now.toDateString() !== last.toDateString();
}

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    resetDaily: (s) => {
      if (shouldReset(s.lastResetAt)) {
        // Unlimited super likes – keep counter unchanged (no reset needed)
        s.superLikesRemaining = s.superLikesRemaining;
        s.lastResetAt = new Date().toISOString();
      }
    },
    consumeSuperLike: (_s) => {
      // Unlimited: no decrement
    }
  }
});

export const { resetDaily, consumeSuperLike } = matchingSlice.actions;
export default matchingSlice.reducer;


