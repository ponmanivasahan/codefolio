import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { userId: req.userId }, include: { template: true } });
  res.json({ success: true, data: profile });
}));

router.put('/', authenticateJWT,
  [
    body('displayName').optional().isString().trim().isLength({ max: 150 }),
    body('headline').optional().isString().trim().isLength({ max: 200 }),
    body('bio').optional().isString().trim().isLength({ max: 1000 }),
    body('location').optional().isString().trim().isLength({ max: 100 }),
    body('profileImage').optional().isString(),
    body('resumeUrl').optional({ checkFalsy: true }).isURL(),
    body('templateId').optional({ nullable: true }).isInt(),
    body('themeMode').optional().isIn(['LIGHT', 'DARK', 'SYSTEM']),
    body('accentColor').optional({ checkFalsy: true }).matches(/^#([0-9A-Fa-f]{3}){1,2}$/),
    body('githubUsername').optional().isString().trim(),
    body('linkedinUrl').optional({ checkFalsy: true }).isURL(),
    body('websiteUrl').optional({ checkFalsy: true }).isURL(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const allowedFields = ['displayName','headline','bio','location','profileImage','resumeUrl','templateId','themeMode','accentColor','githubUsername','linkedinUrl','websiteUrl'];
    const data = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    }

    const updated = await prisma.profile.update({ where: { userId: req.userId }, data, include: { template: true } });
    res.json({ success: true, data: updated });
  })
);

export default router;
