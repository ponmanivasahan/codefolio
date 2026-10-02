import { Router } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const skills = await prisma.skill.findMany({ where: { userId: req.userId }, orderBy: { displayOrder: 'asc' } });
  res.json({ success: true, data: skills });
}));

router.post('/', authenticateJWT,
  [
    body('name').isString().trim().isLength({ min: 1, max: 100 }),
    body('category').isString().trim().isLength({ min: 1, max: 100 }),
    body('proficiency').optional().isInt({ min: 0, max: 100 }),
    body('displayOrder').optional().isInt(),
  ],
  asyncHandler(async (req, res) => {
    const { name, category, proficiency = 75, displayOrder = 0 } = req.body;
    const skill = await prisma.skill.create({ data: { userId: req.userId, name, category, proficiency, displayOrder } });
    res.status(201).json({ success: true, data: skill });
  })
);

router.put('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.skill.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Skill not found' });
  const data = {};
  for (const f of ['name', 'category', 'proficiency', 'displayOrder']) {
    if (req.body[f] !== undefined) data[f] = req.body[f];
  }
  const updated = await prisma.skill.update({ where: { id }, data });
  res.json({ success: true, data: updated });
}));

router.delete('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.skill.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Skill not found' });
  await prisma.skill.delete({ where: { id } });
  res.json({ success: true, message: 'Skill deleted' });
}));

router.post('/bulk', authenticateJWT, asyncHandler(async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) return res.status(400).json({ success: false, message: 'skills must be an array' });
  const data = skills.map((s, i) => ({ userId: req.userId, name: s.name, category: s.category, proficiency: s.proficiency || 75, displayOrder: i }));
  await prisma.skill.createMany({ data });
  res.json({ success: true, message: 'Skills saved' });
}));

export default router;
