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
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.passwordHash!);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Invalid payload' });
  }
});

// Registration with phone number
const registrationSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be 18 or older').max(65, 'Age must be 65 or younger'),
  gender: z.string().min(1, 'Please select gender'),
  occupation: z.string().min(2, 'Occupation must be at least 2 characters')
});

router.post('/register-phone', async (req, res) => {
  try {
    const body = registrationSchema.parse(req.body);
    
    // Check if user already exists with this phone number
    const existingUser = await UserModel.findOne({ phone: body.phone });
    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Create new user
    const user = await UserModel.create({
      phone: body.phone,
      name: body.name,
      age: body.age,
      gender: body.gender,
      occupation: body.occupation,
    });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    
    return res.json({ 
      userId: user._id.toString(), 
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        occupation: user.occupation
      }
    });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Invalid registration data' });
  }
});

// OTP verify flow to match mobile app
// For demo: accept any OTP if it is 4-6 digits and create/find user by phone
const otpSchema = z.object({ phone: z.string().regex(/^\d{10}$/), otp: z.string().regex(/^\d{4,6}$/) });

// Send OTP (demo - in production, integrate with SMS service)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = z.object({ phone: z.string().regex(/^\d{10}$/) }).parse(req.body);
    
    // For demo purposes, we'll just return a success message
    // In production, you would integrate with Twilio, AWS SNS, or similar service
    console.log(`OTP would be sent to ${phone} in production`);
    
    return res.json({ message: 'OTP sent successfully (demo mode)' });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Invalid phone number' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = otpSchema.parse(req.body);
    
    // For demo purposes, accept any 4-6 digit OTP
    if (!/^\d{4,6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }
    
    // Find user by phone
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'dev_secret_change_me', {
      expiresIn: '30d',
    });
    
    return res.json({ 
      userId: user._id.toString(), 
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        occupation: user.occupation
      }
    });
  } catch (e: any) {
    return res.status(400).json({ message: e?.message || 'Invalid phone/otp' });
  }
});


