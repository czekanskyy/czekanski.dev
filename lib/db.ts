import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read JSON file
export async function readJSONFile<T>(filename: string): Promise<T | null> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Write JSON file
export async function writeJSONFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Read content.json
export async function getContent() {
  const content = await readJSONFile('content.json');
  return content || getDefaultContent();
}

// Write content.json
export async function saveContent(content: any) {
  await writeJSONFile('content.json', content);
}

// Default content structure
function getDefaultContent() {
  return {
    hero: {
      name: 'Dominik',
      jobTitle: 'Front End & WordPress Developer',
      backgroundVideo: '/background.mp4',
    },
    about: {
      profileImage: '/profile.jpg',
      paragraph1: '"Hello there." I\'m Dominik, a Web Developer specializing in WordPress & Next.js. Currently completing my B.Eng. in Aeronautics, I bring a distinct engineering mindset to web development. I treat every project like a flight operation: prioritizing performance, stability, and precise execution.',
      paragraph2: 'My focus goes beyond writing lines of code; I architect solutions that are clean, maintainable, and reliable. Whether building a simple WordPress landing page or a complex, scalable web app, I bridge the gap between technical logic and user experience. When I\'m not coding, I\'m likely in the cockpit training for my ATPL or analyzing aircraft systems.',
    },
    projects: {
      featured: {
        title: 'Featured Project',
        description: 'This is the project I am currently working on. It features a modern tech stack and solves a real-world problem. The description highlights the key challenges and solutions implemented.',
        image: '/placeholder-project.jpg',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        tags: ['Next.js', 'TypeScript', 'Tailwind'],
      },
      items: Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        title: `Project ${i + 1}`,
        description: 'Short description of the project. This is a placeholder text to demonstrate the layout.',
        image: '/placeholder-project.jpg',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        tags: ['React', 'CSS'],
      })),
    },
    skills: [
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
    career: [
      {
        id: 1,
        role: 'Web Admin',
        company: 'Sentistocks | Sentimenti',
        period: '2023 - present',
        description: 'Since 2023, I have been responsible for managing and maintaining the company website built on WordPress. My duties include updating content, optimizing performance, ensuring security, and implementing new features using Elementor and WooCommerce to enhance user experience and support business growth.',
        technologies: ['WordPress', 'WooCommerce', 'Elementor', 'Hosting Management', 'Stripe Payment Gateway'],
      },
      {
        id: 2,
        role: 'B.Eng. Student',
        company: 'Rzeszów University of Technology',
        period: '2023 - present',
        description: 'Currently pursuing a Bachelor of Engineering degree in Aviation Engineering in the heart of Poland\'s \'Aviation Valley\'. Alongside academic research, I am actively training for the Air Transport Pilot License (ATPL). This rigorous background in aerodynamics and complex aircraft systems sharpens my analytical skills and attention to detail—traits I directly translate into building stable, high-performance web applications.',
        technologies: ['MATLAB', 'Simulink', 'AutoCAD', 'Ansys'],
      },
      {
        id: 3,
        role: 'IT Technician',
        company: '"Elektryk" Krosno High School',
        period: '2019 - 2023',
        description: 'Graduated with the IT Technician title, establishing a strong foundation in computer science. The curriculum covered hardware architecture, network administration, and database management. This period transformed my early passion for technology into a professional skill set, serving as the technical launchpad for my current career in modern web development.',
        technologies: ['Network Configuration', 'Database Management', 'Hardware Troubleshooting'],
      },
    ],
    contact: {
      description: "I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
      ],
    },
    siteSettings: {
      title: 'Dominik Czekański 👨🏻‍💻',
      description: "Hi, I'm Dominik and I sincerely welcome you to my website!",
    },
  };
}
