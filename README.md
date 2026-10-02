# 🚀 CodeFolio — Developer Portfolio Builder

> **"Your Code. Your Story. Your Portfolio."**

CodeFolio is a production-ready SaaS platform for developers to create stunning portfolio websites without writing HTML/CSS. It combines a powerful CMS dashboard with a dynamic template engine to deliver unique portfolio experiences.

---

## ✨ Features

- **4 Unique Templates** — Minimal, Terminal, Cyber Grid, Executive
- **Developer Command Palette** — Press `Ctrl+K` on any portfolio
- **Portfolio DNA Visualization** — Auto-generated skill distribution chart
- **Project Impact System** — Problem → Solution → Impact storytelling
- **Live Analytics Dashboard** — Views, referrers, device breakdown with Recharts
- **Contact Form System** — Messages saved to MySQL, emails via Nodemailer
- **Auto-save** — Debounced saving with visual status indicator
- **Onboarding Flow** — 6-step guided setup wizard
- **Version Snapshots** — Publish history with rollback support
- **Custom Domains** — Pro feature with CNAME verification workflow
- **Free & Pro Plans** — Subscription-based premium feature gating
- **Full Authentication** — JWT, bcrypt, password reset via email
- **SEO Metadata** — Dynamic Open Graph + Twitter tags per portfolio
- **Dark / Light Theme** — System-aware with manual toggle
- **Responsive** — Mobile, Tablet, Desktop, Large screens

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js, REST API |
| Database | MySQL + Prisma ORM |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (Ethereal in dev) |
| Charts | Recharts |
| Search | Fuse.js (command palette) |
| Hotkeys | react-hotkeys-hook |

---

## 📁 Project Structure

```
codefolio/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── pages/           # Route pages (Landing, Auth, Dashboard, Public)
│       │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│       │   └── dashboard/   # Overview, Profile, Projects, Skills, etc.
│       ├── templates/       # Portfolio templates + renderer
│       │   ├── MinimalTemplate.jsx
│       │   ├── TerminalTemplate.jsx
│       │   ├── CyberGridTemplate.jsx
│       │   ├── ExecutiveTemplate.jsx
│       │   ├── PortfolioRenderer.jsx
│       │   └── components/  # CommandPalette, DNAChart, ContactForm
│       ├── layouts/         # DashboardLayout
│       ├── context/         # AuthContext, ThemeContext
│       ├── services/        # api.js (Axios instance)
│       └── pages/Onboarding.jsx, PublicPortfolio.jsx
│
├── server/                  # Node.js + Express backend
│   └── src/
│       ├── routes/          # auth, profile, projects, skills, socialLinks,
│       │                    # templates, portfolio, contact, analytics,
│       │                    # messages, domains, publish
│       ├── middleware/      # authenticate.js, errorHandler.js
│       ├── prisma.js        # Prisma client singleton
│       ├── app.js           # Express app setup
│       └── server.js        # HTTP server entry point
│
├── prisma/
│   ├── schema.prisma        # MySQL schema (11 models)
│   └── seed.js              # Demo data seeder (4 templates, 4 demo users)
│
├── package.json             # Root monorepo scripts
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm 9+

### 1. Clone and install
```bash
git clone https://github.com/yourname/codefolio.git
cd codefolio
npm run install:all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/codefolio"
JWT_SECRET="your-super-secret-jwt-key"
CLIENT_URL="http://localhost:5173"
PORT=4000
```

### 3. Create MySQL database
```sql
CREATE DATABASE codefolio;
```

### 4. Run migrations
```bash
cd server
npx prisma migrate dev --name init
```

### 5. Seed demo data
```bash
npm run seed
```

### 6. Start development servers
```bash
# Terminal 1 — Backend (port 4000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open http://localhost:5173

---

## 🎭 Demo Portfolios

After seeding, visit these public portfolios:

| URL | Template | Plan |
|---|---|---|
| http://localhost:5173/demo1 | Minimal | Free |
| http://localhost:5173/demo2 | Terminal | Pro |
| http://localhost:5173/demo3 | Cyber Grid | Pro |
| http://localhost:5173/demo4 | Executive | Pro |

**Demo login credentials:**
- Email: `demo1@codefolio.dev` (or demo2/3/4)
- Password: `password123`

---

## 🔑 API Reference

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/profile
PUT    /api/profile

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/reorder

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id
POST   /api/skills/bulk

GET    /api/social-links
POST   /api/social-links
PUT    /api/social-links/:id
DELETE /api/social-links/:id

GET    /api/templates

GET    /api/portfolio/:username
POST   /api/contact/:username

GET    /api/analytics

GET    /api/messages
PUT    /api/messages/:id
DELETE /api/messages/:id

GET    /api/domains
POST   /api/domains
POST   /api/domains/:id/verify
DELETE /api/domains/:id

POST   /api/publish
POST   /api/publish/draft
GET    /api/publish/versions
POST   /api/publish/rollback/:id

GET    /api/health
```

---

## 🎨 Template Engine

Templates follow a shared **Portfolio Data Contract**:

```js
{
  profile: Profile,
  projects: Project[],
  skills: Skill[],
  socialLinks: SocialLink[],
  template: Template,
}
```

`PortfolioRenderer` uses lazy-loaded code splitting to load only the selected template bundle. Add a new template by:
1. Create `src/templates/MyTemplate.jsx` consuming the data contract
2. Add it to the `templateMap` in `PortfolioRenderer.jsx`
3. Insert a DB record in the templates table

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client && npm run build
# Deploy dist/ to Vercel
```

### Backend → Railway / Render
Set environment variables in the platform dashboard. Run migrations on deploy:
```bash
npx prisma migrate deploy
```

---

## 📄 License
MIT
