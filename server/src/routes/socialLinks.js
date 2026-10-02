import { Router } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const links = await prisma.socialLink.findMany({ where: { userId: req.userId }, orderBy: { displayOrder: 'asc' } });
  res.json({ success: true, data: links });
}));

router.post('/', authenticateJWT,
  [body('platform').isString().trim().notEmpty(), body('url').isURL()],
  asyncHandler(async (req, res) => {
    const { platform, url, displayOrder = 0 } = req.body;
    const link = await prisma.socialLink.create({ data: { userId: req.userId, platform, url, displayOrder } });
    res.status(201).json({ success: true, data: link });
  })
);

router.put('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.socialLink.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Social link not found' });
  const data = {};
  for (const f of ['platform', 'url', 'displayOrder']) { if (req.body[f] !== undefined) data[f] = req.body[f]; }
  const updated = await prisma.socialLink.update({ where: { id }, data });
  res.json({ success: true, data: updated });
}));

router.delete('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.socialLink.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Social link not found' });
  await prisma.socialLink.delete({ where: { id } });
  res.json({ success: true, message: 'Social link deleted' });
}));

router.post('/bulk', authenticateJWT, asyncHandler(async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) return res.status(400).json({ success: false, message: 'links must be an array' });
  await prisma.socialLink.deleteMany({ where: { userId: req.userId } });
  const data = links.map((l, i) => ({ userId: req.userId, platform: l.platform, url: l.url, displayOrder: i }));
  if (data.length) await prisma.socialLink.createMany({ data });
  res.json({ success: true, message: 'Social links saved' });
}));

export default router;
