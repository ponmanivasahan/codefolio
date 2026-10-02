import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const userId = req.userId;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [total, todayCount, weekCount, monthCount, recentViews] = await Promise.all([
    prisma.portfolioView.count({ where: { userId } }),
    prisma.portfolioView.count({ where: { userId, viewedAt: { gte: today } } }),
    prisma.portfolioView.count({ where: { userId, viewedAt: { gte: weekAgo } } }),
    prisma.portfolioView.count({ where: { userId, viewedAt: { gte: monthAgo } } }),
    prisma.portfolioView.findMany({ where: { userId, viewedAt: { gte: monthAgo } }, select: { viewedAt: true, referrer: true, userAgent: true }, orderBy: { viewedAt: 'asc' } }),
  ]);

  // Build daily views for last 30 days
  const dailyMap = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(monthAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0];
    dailyMap[key] = 0;
  }
  for (const v of recentViews) {
    const key = v.viewedAt.toISOString().split('T')[0];
    if (dailyMap[key] !== undefined) dailyMap[key]++;
  }
  const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

  // Referrers
  const referrerMap = {};
  for (const v of recentViews) {
    const ref = v.referrer || 'Direct';
    referrerMap[ref] = (referrerMap[ref] || 0) + 1;
  }
  const topReferrers = Object.entries(referrerMap).sort((a,b) => b[1]-a[1]).slice(0, 10).map(([referrer, count]) => ({ referrer, count }));

  // Device breakdown (simplified)
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  for (const v of recentViews) {
    const ua = (v.userAgent || '').toLowerCase();
    if (/mobile|android|iphone/.test(ua)) devices.mobile++;
    else if (/tablet|ipad/.test(ua)) devices.tablet++;
    else devices.desktop++;
  }

  res.json({ success: true, data: { total, today: todayCount, week: weekCount, month: monthCount, dailyViews, topReferrers, devices } });
}));

export default router;
