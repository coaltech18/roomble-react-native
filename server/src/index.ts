import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { router as authRouter } from './routes/auth';
import { router as usersRouter } from './routes/users';
import { router as matchesRouter } from './routes/matches';
import { router as chatsRouter } from './routes/chats';

const app = express();

// Configure CORS for production and development
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8082',
    'https://ngrok.io',
    'https://*.ngrok.io',
    'https://*.ngrok-free.app',
    'exp://localhost:8081',
    'exp://localhost:8082',
    // Add your Render domain here after deployment
    'https://*.onrender.com',
    // Add your Expo app domains
    'exp://*',
    'https://expo.dev'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'roomble-server' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/chats', chatsRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Please set it in .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


