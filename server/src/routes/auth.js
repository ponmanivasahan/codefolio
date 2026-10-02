import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const RESERVED = ['admin','login','register','dashboard','api','settings','about','contact','pricing','help','support','terms','privacy','blog','careers','team'];

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register',
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address.'),
    body('username').isString().trim().matches(/^[a-z0-9-]+$/).withMessage('Username can only contain lowercase letters, numbers, and hyphens.')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });

    const { name, email, username, password } = req.body;

    if (RESERVED.includes(username)) return res.status(400).json({ success: false, message: 'That username is reserved. Please choose another.' });

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);
    if (existingEmail) return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    if (existingUsername) return res.status(409).json({ success: false, message: 'That username is already taken.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name, email, username, passwordHash,
        profile: { create: { username, displayName: name, themeMode: 'DARK', status: 'DRAFT' } },
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
      },
      select: { id: true, name: true, email: true, username: true },
    });

    const token = signToken(user.id);
    res.status(201).json({ success: true, data: { token, user } });
  })
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email.'),
    body('password').exists().withMessage('Password is required.')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = signToken(user.id);
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, data: { token, user: safeUser } });
  })
);

// GET /api/auth/me
router.get('/me', authenticateJWT, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, name: true, email: true, username: true, createdAt: true,
      profile: true,
      subscription: true,
    },
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
}));

// POST /api/auth/forgot-password
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email.')],
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const exp = new Date(Date.now() + 60 * 60 * 1000); 
      await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExp: exp } });

      let transporter;
      if (!process.env.SMTP_USER) {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: testAccount.user, pass: testAccount.pass } });
      } else {
        transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
      }
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@codefolio.dev',
        to: email,
        subject: 'Reset your CodeFolio password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
      });
      console.log('Password reset email URL:', nodemailer.getTestMessageUrl(info));
    }
    res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
  })
);

// POST /api/auth/reset-password
router.post('/reset-password',
  [
    body('token').isString().notEmpty().withMessage('Token is missing.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
  ],
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExp: { gte: new Date() } } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetToken: null, resetTokenExp: null } });
    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  })
);

export default router;