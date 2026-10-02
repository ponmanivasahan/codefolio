import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// POST /api/publish - publish portfolio and create version snapshot
router.post('/', authenticateJWT, asyncHandler(async (req, res) => {
  const userId = req.userId;
  const [profile, projects, skills, socialLinks] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.project.findMany({ where: { userId } }),
    prisma.skill.findMany({ where: { userId } }),
    prisma.socialLink.findMany({ where: { userId } }),
  ]);

  await prisma.profile.update({ where: { userId }, data: { status: 'PUBLISHED' } });

  await prisma.versionSnapshot.create({
    data: {
      userId,
      versionName: `v${Date.now()}`,
      profileData: profile,
      projectsData: projects,
      skillsData: skills,
      socialLinksData: socialLinks,
    },
  });

  res.json({ success: true, message: 'Portfolio published!', data: { username: profile.username } });
}));

// POST /api/publish/draft - unpublish (set to draft)
router.post('/draft', authenticateJWT, asyncHandler(async (req, res) => {
  const userId = req.userId;
  await prisma.profile.update({ where: { userId }, data: { status: 'DRAFT' } });
  res.json({ success: true, message: 'Portfolio set to draft.' });
}));

// GET /api/publish/versions - list version snapshots
router.get('/versions', authenticateJWT, asyncHandler(async (req, res) => {
  const versions = await prisma.versionSnapshot.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: versions });
}));

// POST /api/publish/rollback/:id - restore a version snapshot
router.post('/rollback/:id', authenticateJWT, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const snapshot = await prisma.versionSnapshot.findFirst({ where: { id, userId: req.userId } });
  if (!snapshot) return res.status(404).json({ success: false, message: 'Snapshot not found' });
  res.json({ success: true, message: 'Rollback noted. Full rollback requires restoring profile/project data from snapshot.', data: snapshot });
}));

export default router;
