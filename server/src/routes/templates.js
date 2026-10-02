import { Router } from 'express';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const templates = await prisma.template.findMany({ orderBy: { id: 'asc' } });
  res.json({ success: true, data: templates });
}));

export default router;
