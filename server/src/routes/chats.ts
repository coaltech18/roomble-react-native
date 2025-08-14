import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { ChatModel } from '../models/Chat';

export const router = Router();

// List user's chats (latest first)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const chats = await ChatModel.find({ userIds: req.user!.id })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();
  res.json(chats);
});

// Send a message (creates chat if none)
router.post('/message', requireAuth, async (req: AuthRequest, res) => {
  const { toUserId, text } = req.body as { toUserId: string; text: string };
  if (!toUserId || !text) return res.status(400).json({ error: 'toUserId and text required' });

  const ids = [req.user!.id, toUserId];
  let chat = await ChatModel.findOne({ userIds: { $all: ids } });
  if (!chat) {
    chat = await ChatModel.create({ userIds: ids, messages: [] });
  }
  chat.messages.push({ senderId: req.user!.id, text });
  await chat.save();
  res.status(201).json(chat);
});


