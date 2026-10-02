import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const requirePro = async (req, res, next) => {
  const sub = await prisma.subscription.findUnique({ where: { userId: req.userId } });
  if (!sub || sub.plan !== 'PRO' || sub.status !== 'ACTIVE') {
    return res.status(403).json({ success: false, message: 'Custom domains require a Pro subscription.' });
  }
  next();
};

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const domains = await prisma.customDomain.findMany({ where: { userId: req.userId } });
  res.json({ success: true, data: domains });
}));

router.post('/', authenticateJWT, requirePro,
  [body('domain').isFQDN()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid domain name' });
    const { domain } = req.body;
    const existing = await prisma.customDomain.findUnique({ where: { domain } });
    if (existing) return res.status(409).json({ success: false, message: 'Domain already registered' });
    const cnameTarget = 'codefolio.vercel.app'; // Production CNAME target
    const record = await prisma.customDomain.create({ data: { userId: req.userId, domain, cnameTarget, verificationStatus: 'PENDING' } });
    res.status(201).json({ success: true, data: record });
  })
);

router.post('/:id/verify', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = await prisma.customDomain.findFirst({ where: { id, userId: req.userId } });
  if (!record) return res.status(404).json({ success: false, message: 'Domain not found' });
  // In production: perform actual DNS lookup. For now, simulate.
  res.json({ success: true, message: 'In production, a DNS CNAME check would run here. Currently set to PENDING.', data: record });
}));

router.delete('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = await prisma.customDomain.findFirst({ where: { id, userId: req.userId } });
  if (!record) return res.status(404).json({ success: false, message: 'Domain not found' });
  await prisma.customDomain.delete({ where: { id } });
  res.json({ success: true, message: 'Domain removed' });
}));

export default router;
