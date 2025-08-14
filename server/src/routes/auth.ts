import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../models/User';

export const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

router.post('/register', async (req, res) => {
  try {
    const body = credentialsSchema.parse(req.body);
    const existing = await UserModel.findOne({ email: body.email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(body.password, 10);
    const user = await UserModel.create({
      email: body.email,
      passwordHash: hash,
      name: body.name || body.email.split('@')[0],
    });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Invalid payload' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const body = credentialsSchema.pick({ email: true, password: true }).parse(req.body);
    const user = await UserModel.findOne({ email: body.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Invalid payload' });
  }
});

// OTP verify flow to match mobile app
// For demo: accept any OTP if it is 4-6 digits and create/find user by phone
const otpSchema = z.object({ phone: z.string().regex(/^\d{10}$/), otp: z.string().regex(/^\d{4,6}$/) });

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone } = otpSchema.parse(req.body);
    // Find or create a user by phone
    let user = await UserModel.findOne({ phone });
    if (!user) {
      user = await UserModel.create({ phone, name: `User${phone.slice(-4)}` });
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    return res.json({ userId: user._id.toString(), token });
  } catch (e: any) {
    return res.status(400).json({ message: e?.message || 'Invalid phone/otp' });
  }
});


