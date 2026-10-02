import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import projectRouter from './routes/projects.js';
import skillRouter from './routes/skills.js';
import socialLinkRouter from './routes/socialLinks.js';
import templateRouter from './routes/templates.js';
import portfolioRouter from './routes/portfolio.js';
import contactRouter from './routes/contact.js';
import analyticsRouter from './routes/analytics.js';
import messageRouter from './routes/messages.js';
import domainRouter from './routes/domains.js';
import publishRouter from './routes/publish.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectRouter);
app.use('/api/skills', skillRouter);
app.use('/api/social-links', socialLinkRouter);
app.use('/api/templates', templateRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/contact', contactRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/messages', messageRouter);
app.use('/api/domains', domainRouter);
app.use('/api/publish', publishRouter);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'CodeFolio API is running 🚀' }));

app.use(errorHandler);

export default app;
