import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = { userId: req.userId };
  if (status) where.status = status.toUpperCase();
  const messages = await prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: messages });
}));

router.put('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.contactMessage.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Message not found' });
  const { status } = req.body;
  const updated = await prisma.contactMessage.update({ where: { id }, data: { status: status?.toUpperCase() } });
  res.json({ success: true, data: updated });
}));

router.delete('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.contactMessage.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Message not found' });
  await prisma.contactMessage.delete({ where: { id } });
  res.json({ success: true, message: 'Message deleted' });
}));

export default router;
