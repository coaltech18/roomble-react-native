import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

export const router = Router();

// Get own profile
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await UserModel.findById(req.user!.id).lean();
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update preferences
router.patch('/me/preferences', requireAuth, async (req: AuthRequest, res) => {
  const update = req.body || {};
  const user = await UserModel.findByIdAndUpdate(
    req.user!.id,
    { $set: { preferences: { ...update } } },
    { new: true }
  ).lean();
  res.json(user);
});

// Potential matches with optional filters (matches app call)
router.get('/potential-matches', requireAuth, async (req: AuthRequest, res) => {
  try {
    const filterParam = req.query.filters as string | undefined;
    const filters = filterParam ? JSON.parse(filterParam) : undefined;

    const query: any = { isActive: true };
    if (filters?.preferredAreas?.length) {
      query['preferences.preferredAreas'] = { $in: filters.preferredAreas };
    }
    if (filters?.budgetRange) {
      query['preferences.budgetRange.0'] = { $lte: filters.budgetRange[1] };
      query['preferences.budgetRange.1'] = { $gte: filters.budgetRange[0] };
    }
    if (typeof filters?.startupCollaboration === 'boolean') {
      query['preferences.startupCollaboration'] = filters.startupCollaboration;
    }
    if (typeof filters?.familyVisitAccommodation === 'boolean') {
      query['preferences.familyVisitAccommodation'] = filters.familyVisitAccommodation;
    }

    const users = await UserModel.find(query).limit(50).lean();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: 'Invalid filters' });
  }
});


