import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const defaultSections = [
  {
    key: 'hero',
    title: 'Hero Section',
    navTitle: 'Home',
    slug: 'hero',
    order: 1,
    data: {
      name: 'Dominik',
      jobTitle: 'Front End & WordPress Developer',
      backgroundVideo: '/background.mp4',
    },
  },
  {
    key: 'about',
    title: 'About Me',
    navTitle: 'About',
    slug: 'about',
    order: 2,
    data: {
      profileImage: '/profile.jpg',
      paragraph1:
        '"Hello there." I\'m Dominik, a Web Developer specializing in WordPress & Next.js. Currently completing my B.Eng. in Aeronautics, I bring a distinct engineering mindset to web development. I treat every project like a flight operation: prioritizing performance, stability, and precise execution.',
      paragraph2:
        "My focus goes beyond writing lines of code; I architect solutions that are clean, maintainable, and reliable. Whether building a simple WordPress landing page or a complex, scalable web app, I bridge the gap between technical logic and user experience. When I'm not coding, I'm likely in the cockpit training for my ATPL or analyzing aircraft systems.",
    },
  },
  {
    key: 'projects',
    title: 'Projects',
    navTitle: 'Projects',
    slug: 'projects',
    order: 3,
    data: {
      featured: {
        title: 'Featured Project',
        description: 'This is the project I am currently working on. It features a modern tech stack and solves a real-world problem.',
        image: '/placeholder-project.jpg',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        tags: ['Next.js', 'TypeScript', 'Tailwind'],
      },
      items: Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        title: `Project ${i + 1}`,
        description: 'Short description of the project.',
        image: '/placeholder-project.jpg',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        tags: ['React', 'CSS'],
      })),
    },
  },
  {
    key: 'skills',
    title: 'Skills',
    navTitle: 'Skills',
    slug: 'skills',
    order: 4,
    data: [
      {
        category: 'Frontend Development',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      },
      {
        category: 'Backend Development',
        skills: ['Node.js', 'SQL', 'Docker', 'REST APIs'],
      },
      {
        category: 'Wordpress Development',
        skills: ['WordPress', 'WooCommerce', 'Elementor', 'PHP'],
      },
    ],
  },
  {
    key: 'career',
    title: 'Career',
    navTitle: 'Career',
    slug: 'career',
    order: 5,
    data: [
      {
        id: 1,
        role: 'Web Admin',
        company: 'Sentistocks | Sentimenti',
        period: '2023 - present',
        description: 'Since 2023, I have been responsible for managing and maintaining the company website built on WordPress.',
        technologies: ['WordPress', 'WooCommerce', 'Elementor', 'Hosting Management', 'Stripe Payment Gateway'],
      },
      {
        id: 2,
        role: 'B.Eng. Student',
        company: 'Rzeszów University of Technology',
        period: '2023 - present',
        description: "Currently pursuing a Bachelor of Engineering degree in Aviation Engineering in the heart of Poland's 'Aviation Valley'.",
        technologies: ['MATLAB', 'Simulink', 'AutoCAD', 'Ansys'],
      },
      {
        id: 3,
        role: 'IT Technician',
        company: '"Elektryk" Krosno High School',
        period: '2019 - 2023',
        description: 'Graduated with the IT Technician title, establishing a strong foundation in computer science.',
        technologies: ['Network Configuration', 'Database Management', 'Hardware Troubleshooting'],
      },
    ],
  },
  {
    key: 'contact',
    title: 'Contact',
    navTitle: 'Contact',
    slug: 'contact',
    order: 6,
    data: {
      description: "I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
      ],
    },
  },
  {
    key: 'siteSettings',
    title: 'Site Settings',
    navTitle: null,
    slug: null,
    order: 99,
    data: {
      title: 'Dominik Czekański 👨🏻‍💻',
      description: "Hi, I'm Dominik and I sincerely welcome you to my website!",
    },
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed sections
  for (const section of defaultSections) {
    await prisma.section.upsert({
      where: { key: section.key },
      update: {
        title: section.title,
        navTitle: section.navTitle,
        slug: section.slug,
        order: section.order,
        data: section.data,
      },
      create: {
        key: section.key,
        title: section.title,
        navTitle: section.navTitle,
        slug: section.slug,
        order: section.order,
        data: section.data,
      },
    });
    console.log(`  ✓ Section: ${section.key}`);
  }

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@czekanski.dev';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
    },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  console.log('✅ Seed complete!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
