import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { MatchModel } from '../models/Match';

export const router = Router();

// Swipe endpoint expected by the app: POST /api/matches/swipe { targetUserId, action }
router.post('/swipe', requireAuth, async (req: AuthRequest, res) => {
  const { targetUserId, action } = req.body as { targetUserId: string; action: 'like' | 'nope' | 'super' };
  if (!targetUserId) return res.status(400).json({ error: 'targetUserId required' });

  // Only create/acknowledge matches when action is 'like' or 'super'
  if (action === 'nope') return res.json({ ok: true });

  const ids = [req.user!.id, targetUserId].sort();
  const [userA, userB] = ids;

  const existing = await MatchModel.findOne({ userA, userB });
  if (existing) {
    if (!existing.isMutual) existing.isMutual = true;
    await existing.save();
    return res.json(existing);
  }

  const match = await MatchModel.create({ userA, userB, isMutual: false });
  return res.status(201).json(match);
});

// List my matches
router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  const matches = await MatchModel.find({ $or: [{ userA: req.user!.id }, { userB: req.user!.id }] })
    .sort({ updatedAt: -1 })
    .lean();
  res.json(matches);
});


