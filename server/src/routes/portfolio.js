import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: { include: { template: true } },
      projects: { orderBy: { displayOrder: 'asc' } },
      skills: { orderBy: { displayOrder: 'asc' } },
      socialLinks: { orderBy: { displayOrder: 'asc' } },
      subscription: true,
    },
  });

  if (!user || !user.profile) {
    return res.status(404).json({ success: false, message: 'Portfolio not found' });
  }
  if (user.profile.status !== 'PUBLISHED') {
    return res.status(404).json({ success: false, message: 'This portfolio is not published yet' });
  }

  // Log view (hash IP for privacy)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ipHash = crypto.createHash('sha256').update(String(ip)).digest('hex');
  await prisma.portfolioView.create({
    data: { userId: user.id, ipHash, userAgent: req.headers['user-agent'] || null, referrer: req.headers.referer || null },
  }).catch(() => {}); // non-critical

  const { passwordHash, resetToken, resetTokenExp, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
}));

export default router;
