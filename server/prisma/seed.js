import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // Upsert templates
  const templates = [
    { name: 'Minimal', slug: 'minimal', description: 'Clean, minimal design with elegant typography', previewImage: null, isPremium: false },
    { name: 'Terminal', slug: 'terminal', description: 'Hacker-inspired terminal aesthetic', previewImage: null, isPremium: false },
    { name: 'Cyber Grid', slug: 'cyber-grid', description: 'Futuristic neon cyber grid layout', previewImage: null, isPremium: true },
    { name: 'Executive', slug: 'executive', description: 'Professional executive portfolio style', previewImage: null, isPremium: true },
  ];

  const templateMap = {};
  for (const t of templates) {
    const tmpl = await prisma.template.upsert({ where: { slug: t.slug }, update: t, create: t });
    templateMap[t.slug] = tmpl.id;
  }
  console.log(' Templates seeded');

  // Demo users
  const demoUsers = [
    {
      name: 'Alex Rivera', email: 'demo1@codefolio.dev', username: 'demo1', plan: 'FREE', templateSlug: 'minimal',
      headline: 'Full Stack Developer & Open Source Enthusiast',
      bio: 'I build fast, scalable web applications with React and Node.js. Passionate about clean code, developer experience, and open source.',
      location: 'San Francisco, CA',
      github: 'alexrivera',
      skills: [
        { name: 'React', category: 'Frontend', proficiency: 92 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 88 },
        { name: 'CSS/Tailwind', category: 'Frontend', proficiency: 90 },
        { name: 'Node.js', category: 'Backend', proficiency: 85 },
        { name: 'Express', category: 'Backend', proficiency: 82 },
        { name: 'MySQL', category: 'Database', proficiency: 78 },
        { name: 'PostgreSQL', category: 'Database', proficiency: 75 },
        { name: 'Docker', category: 'DevOps', proficiency: 70 },
        { name: 'Git', category: 'Tools', proficiency: 95 },
      ],
      projects: [
        {
          title: 'TaskFlow — Project Management Tool',
          description: 'A real-time project management platform built for remote teams. Features kanban boards, time tracking, and team chat.',
          techStack: 'React,Node.js,MySQL,Socket.io,Redis',
          repoUrl: 'https://github.com/alexrivera/taskflow',
          liveUrl: 'https://taskflow.demo.com',
          featured: true, displayOrder: 0,
          problem: 'Remote teams struggled to coordinate across time zones without a unified, real-time workspace.',
          solution: 'Built a real-time kanban board with Socket.io, supporting concurrent editing and instant updates.',
          impact: 'Reduced team stand-up meetings by 40% and improved sprint velocity by 25% for 5 pilot teams.',
        },
        {
          title: 'OpenMetrics — Observability Dashboard',
          description: 'A lightweight, self-hosted analytics and metrics dashboard for small to medium web applications.',
          techStack: 'React,Recharts,Express,TimescaleDB',
          repoUrl: 'https://github.com/alexrivera/openmetrics',
          liveUrl: null,
          featured: true, displayOrder: 1,
          problem: 'Existing observability tools were too expensive and complex for indie developers and small teams.',
          solution: 'Created a self-hosted alternative using TimescaleDB and a clean React dashboard.',
          impact: 'Used by 200+ developers in production, saving ~$300/mo per team compared to Datadog.',
        },
      ],
    },
    {
      name: 'Priya Sharma', email: 'demo2@codefolio.dev', username: 'demo2', plan: 'PRO', templateSlug: 'terminal',
      headline: 'Backend Engineer | API Architect | Cloud Native',
      bio: 'Backend engineer specializing in distributed systems, microservices, and cloud-native architectures. I turn complex infrastructure problems into elegant solutions.',
      location: 'Bangalore, India',
      github: 'priyasharma',
      skills: [
        { name: 'Python', category: 'Backend', proficiency: 95 },
        { name: 'Go', category: 'Backend', proficiency: 80 },
        { name: 'FastAPI', category: 'Backend', proficiency: 88 },
        { name: 'Kafka', category: 'DevOps', proficiency: 75 },
        { name: 'Kubernetes', category: 'DevOps', proficiency: 78 },
        { name: 'AWS', category: 'DevOps', proficiency: 82 },
        { name: 'PostgreSQL', category: 'Database', proficiency: 90 },
        { name: 'Redis', category: 'Database', proficiency: 85 },
      ],
      projects: [
        {
          title: 'DataStream — Event Processing Platform',
          description: 'High-throughput event streaming platform handling 1M+ events/day with guaranteed delivery and replay capabilities.',
          techStack: 'Python,Go,Kafka,PostgreSQL,Kubernetes',
          repoUrl: 'https://github.com/priyasharma/datastream',
          liveUrl: null,
          featured: true, displayOrder: 0,
          problem: 'Legacy monolith could not handle event spikes during peak hours, causing data loss.',
          solution: 'Designed event-driven architecture using Kafka with idempotent consumers and dead-letter queues.',
          impact: 'Scaled from 10K to 1M events/day with zero data loss and 99.99% uptime.',
        },
      ],
    },
    {
      name: 'Marcus Johnson', email: 'demo3@codefolio.dev', username: 'demo3', plan: 'PRO', templateSlug: 'cyber-grid',
      headline: 'Frontend Architect | Design Systems | Web Performance',
      bio: 'I craft exceptional user experiences that combine beautiful design with blazing-fast performance. Obsessed with Core Web Vitals and accessibility.',
      location: 'London, UK',
      github: 'marcusjohnson',
      skills: [
        { name: 'React', category: 'Frontend', proficiency: 97 },
        { name: 'Next.js', category: 'Frontend', proficiency: 90 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 92 },
        { name: 'Figma', category: 'Tools', proficiency: 85 },
        { name: 'Web Performance', category: 'Frontend', proficiency: 88 },
        { name: 'CSS Animation', category: 'Frontend', proficiency: 90 },
        { name: 'Storybook', category: 'Tools', proficiency: 80 },
        { name: 'Cypress', category: 'Tools', proficiency: 75 },
      ],
      projects: [
        {
          title: 'Luminary — Design System',
          description: 'A comprehensive React component library and design system powering 12 enterprise products with consistent, accessible UI.',
          techStack: 'React,TypeScript,Storybook,Rollup,CSS-in-JS',
          repoUrl: 'https://github.com/marcusjohnson/luminary',
          liveUrl: 'https://luminary.design',
          featured: true, displayOrder: 0,
          problem: '12 product teams were building inconsistent UIs, creating brand fragmentation and wasted effort.',
          solution: 'Built a tokens-based design system with 80+ components, full accessibility, and Storybook docs.',
          impact: 'Reduced UI development time by 60% across all product teams; 98 Lighthouse accessibility score.',
        },
      ],
    },
    {
      name: 'Sofia Chen', email: 'demo4@codefolio.dev', username: 'demo4', plan: 'PRO', templateSlug: 'executive',
      headline: 'Software Engineering Lead | Fintech | Systems Design',
      bio: 'Engineering leader with 8 years building financial technology platforms. I lead teams to deliver secure, compliant, high-performance systems at scale.',
      location: 'New York, NY',
      github: 'sofiachen',
      skills: [
        { name: 'Java', category: 'Backend', proficiency: 92 },
        { name: 'Spring Boot', category: 'Backend', proficiency: 90 },
        { name: 'React', category: 'Frontend', proficiency: 75 },
        { name: 'PostgreSQL', category: 'Database', proficiency: 88 },
        { name: 'Kafka', category: 'DevOps', proficiency: 80 },
        { name: 'AWS', category: 'DevOps', proficiency: 85 },
        { name: 'System Design', category: 'Other', proficiency: 92 },
        { name: 'Team Leadership', category: 'Other', proficiency: 88 },
      ],
      projects: [
        {
          title: 'PayCore — Payment Processing Engine',
          description: 'PCI-DSS compliant payment processing engine handling $2B+ in annual transaction volume with sub-100ms latency.',
          techStack: 'Java,Spring Boot,Kafka,PostgreSQL,AWS',
          repoUrl: null,
          liveUrl: null,
          featured: true, displayOrder: 0,
          problem: 'Legacy payment system had 2-3% failure rate and 800ms avg latency, causing revenue loss.',
          solution: 'Re-architected using event sourcing, CQRS, and idempotent retry logic with distributed tracing.',
          impact: 'Reduced failure rate to 0.01%, latency to 80ms, processing $2B+ annually without incidents.',
        },
      ],
    },
  ];

  for (const u of demoUsers) {
    const existingUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (existingUser) {
      console.log(`⏭  Skipping existing user: ${u.username}`);
      continue;
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        username: u.username,
        passwordHash,
        profile: {
          create: {
            username: u.username,
            displayName: u.name,
            headline: u.headline,
            bio: u.bio,
            location: u.location,
            githubUsername: u.github,
            themeMode: 'LIGHT',
            status: 'PUBLISHED',
            templateId: templateMap[u.templateSlug],
          },
        },
        subscription: {
          create: {
            plan: u.plan,
            status: 'ACTIVE',
            startedAt: new Date(),
            expiresAt: u.plan === 'PRO' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null,
          },
        },
      },
    });

    // Skills
    const skillData = u.skills.map((s, i) => ({ userId: createdUser.id, ...s, displayOrder: i }));
    await prisma.skill.createMany({ data: skillData });

    // Projects
    for (let i = 0; i < u.projects.length; i++) {
      const p = u.projects[i];
      const slug = `${u.username}-${p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 50)}-${Date.now()}`;
      await prisma.project.create({
        data: { userId: createdUser.id, ...p, slug, displayOrder: i },
      });
    }

    // Social links
    await prisma.socialLink.createMany({
      data: [
        { userId: createdUser.id, platform: 'GitHub', url: `https://github.com/${u.github}`, displayOrder: 0 },
        { userId: createdUser.id, platform: 'LinkedIn', url: `https://linkedin.com/in/${u.github}`, displayOrder: 1 },
        { userId: createdUser.id, platform: 'Twitter', url: `https://twitter.com/${u.github}`, displayOrder: 2 },
      ],
    });

    console.log(`✅ Seeded user: ${u.username} (${u.plan})`);
  }

  console.log('🎉 Database seeded successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
