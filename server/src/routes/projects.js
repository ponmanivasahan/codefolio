import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const slugify = (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 80);
const uniqueSlug = async (base, userId) => {
  const slug = `${slugify(base)}-${userId}-${Date.now()}`;
  return slug;
};

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({ where: { userId: req.userId }, orderBy: { displayOrder: 'asc' } });
  res.json({ success: true, data: projects });
}));

router.post('/', authenticateJWT,
  [
    body('title').isString().trim().isLength({ min: 1, max: 200 }),
    body('description').optional().isString(),
    body('techStack').optional().isString(),
    body('repoUrl').optional({ checkFalsy: true }).isURL(),
    body('liveUrl').optional({ checkFalsy: true }).isURL(),
    body('screenshotUrl').optional({ checkFalsy: true }).isURL(),
    body('featured').optional().isBoolean(),
    body('displayOrder').optional().isInt(),
    body('problem').optional().isString(),
    body('solution').optional().isString(),
    body('impact').optional().isString(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { title, ...rest } = req.body;
    const slug = await uniqueSlug(title, req.userId);
    const project = await prisma.project.create({ data: { userId: req.userId, title, slug, ...rest } });
    res.status(201).json({ success: true, data: project });
  })
);

router.put('/:id', authenticateJWT,
  [param('id').isInt()],
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.project.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Project not found' });

    const allowedFields = ['title','description','techStack','repoUrl','liveUrl','screenshotUrl','featured','displayOrder','problem','solution','impact'];
    const data = {};
    for (const f of allowedFields) { if (req.body[f] !== undefined) data[f] = req.body[f]; }
    if (data.title && data.title !== existing.title) { data.slug = await uniqueSlug(data.title, req.userId); }

    const updated = await prisma.project.update({ where: { id }, data });
    res.json({ success: true, data: updated });
  })
);

router.delete('/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.project.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ success: false, message: 'Project not found' });
  await prisma.project.delete({ where: { id } });
  res.json({ success: true, message: 'Project deleted' });
}));

// Reorder projects
router.post('/reorder', authenticateJWT, asyncHandler(async (req, res) => {
  const { order } = req.body; // array of { id, displayOrder }
  if (!Array.isArray(order)) return res.status(400).json({ success: false, message: 'order must be an array' });
  await Promise.all(order.map(({ id, displayOrder }) =>
    prisma.project.updateMany({ where: { id: Number(id), userId: req.userId }, data: { displayOrder } })
  ));
  res.json({ success: true, message: 'Projects reordered' });
}));

export default router;
