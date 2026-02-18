import { prisma } from './prisma';

// Get all content as a keyed object, sorted by order
// Falls back to default content if DB is unavailable (e.g. during build/prerendering)
export async function getContent(): Promise<Record<string, any>> {
  try {
    const sections = await prisma.section.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    // Start with defaults to ensure all sections exist
    const content: Record<string, any> = getDefaultContent();

    if (sections.length > 0) {
      for (const section of sections) {
        content[section.key] = {
          ...(section.data as object),
          // Include metadata in the data object for frontend use
          _meta: {
            id: section.id,
            key: section.key,
            title: section.title,
            navTitle: section.navTitle,
            slug: section.slug,
            order: section.order,
          },
        };
      }
    }
    return content;

    // If DB is empty, return defaults
    return getDefaultContent();
  } catch (error) {
    console.warn('⚠️  Database unavailable, using default content:', (error as Error).message);
    return getDefaultContent();
  }
}

// Get a single section
// Falls back to default content if DB is unavailable
export async function getSectionContent(key: string): Promise<any | null> {
  try {
    const section = await prisma.section.findUnique({
      where: { key },
    });

    if (!section) {
      // Fall back to default content
      const defaults = getDefaultContent();
      return defaults[key] ?? null;
    }

    return {
      ...(section.data as object),
      _meta: {
        id: section.id,
        key: section.key,
        title: section.title,
        navTitle: section.navTitle,
        slug: section.slug,
        order: section.order,
      },
    };
  } catch (error) {
    console.warn(`⚠️  Database unavailable for section '${key}', using default:`, (error as Error).message);
    const defaults = getDefaultContent();
    return defaults[key] ?? null;
  }
}

// Save a single section
export async function saveSectionContent(key: string, data: any): Promise<void> {
  // Extract metadata if present, otherwise keep existing or use defaults
  const { _meta, ...sectionData } = data;

  // We need to upsert. If updating, we might want to preserve existing metadata if not provided?
  // But for now, let's assume the editor sends everything it knows.

  // To update metadata, we need to pass it as separate fields to Prisma
  const metadata = _meta || {};

  await prisma.section.upsert({
    where: { key },
    update: {
      data: sectionData,
      title: metadata.title,
      navTitle: metadata.navTitle,
      slug: metadata.slug,
      order: metadata.order,
    },
    create: {
      key,
      data: sectionData,
      title: metadata.title,
      navTitle: metadata.navTitle,
      slug: metadata.slug,
      order: metadata.order ?? 0,
    },
  });
}

// Save full content object (for backward compatibility)
export async function saveContent(content: Record<string, any>): Promise<void> {
  for (const [key, data] of Object.entries(content)) {
    await saveSectionContent(key, data);
  }
}

// Default content structure (used as fallback when DB is empty)
function getDefaultContent(): Record<string, any> {
  return {
    hero: {
      name: 'Dominik',
      jobTitle: 'Front End & WordPress Developer',
      backgroundVideo: '/background.mp4',
      _meta: { key: 'hero', title: 'Hero Section', navTitle: 'Home', slug: 'hero', order: 1 },
    },
    about: {
      profileImage: '/profile.jpg',
      paragraph1: '"Hello there." I\'m Dominik, a Web Developer specializing in WordPress & Next.js.',
      paragraph2: 'My focus goes beyond writing lines of code; I architect solutions that are clean, maintainable, and reliable.',
      _meta: { key: 'about', title: 'About Me', navTitle: 'About', slug: 'about', order: 2 },
    },
    projects: {
      featured: {
        title: 'Featured Project',
        description: 'This is the project I am currently working on.',
        image: '/placeholder-project.jpg',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        tags: ['Next.js', 'TypeScript', 'Tailwind'],
      },
      items: [],
      _meta: { key: 'projects', title: 'Projects', navTitle: 'Projects', slug: 'projects', order: 3 },
    },
    skills: {
      _meta: { key: 'skills', title: 'Skills', navTitle: 'Skills', slug: 'skills', order: 4 },
    },
    career: {
      _meta: { key: 'career', title: 'Career', navTitle: 'Career', slug: 'career', order: 5 },
    },
    contact: {
      description: "I'm currently open to new opportunities.",
      socialLinks: [],
      _meta: { key: 'contact', title: 'Contact', navTitle: 'Contact', slug: 'contact', order: 6 },
    },
    siteSettings: {
      title: 'Dominik Czekański 👨🏻‍💻',
      description: "Hi, I'm Dominik and I sincerely welcome you to my website!",
      _meta: { key: 'siteSettings', title: 'Site Settings', navTitle: null, slug: null, order: 99 },
    },
  };
}
