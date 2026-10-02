import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import rateLimit from 'express-rate-limit';

const router = Router();
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { success: false, message: 'Too many messages. Try again later.' } });

router.post('/:username', contactLimiter,
  [
    body('senderName').isString().trim().isLength({ min: 1, max: 150 }),
    body('senderEmail').isEmail().normalizeEmail(),
    body('subject').optional().isString().trim().isLength({ max: 200 }),
    body('message').isString().trim().isLength({ min: 10, max: 3000 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const user = await prisma.user.findUnique({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const { senderName, senderEmail, subject, message } = req.body;

    // Save to DB
    await prisma.contactMessage.create({
      data: { userId: user.id, senderName, senderEmail, subject: subject || 'New message from portfolio', message },
    });

    // Send email notification
    try {
      let transporter;
      if (!process.env.SMTP_USER) {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: testAccount.user, pass: testAccount.pass } });
      } else {
        transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
      }
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@codefolio.dev',
        to: process.env.SMTP_FROM || 'noreply@codefolio.dev',
        replyTo: senderEmail,
        subject: `[CodeFolio] New message for @${req.params.username}: ${subject || 'No subject'}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
      if (nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (emailErr) {
      console.error('Email send failed (non-critical):', emailErr.message);
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  })
);

export default router;
