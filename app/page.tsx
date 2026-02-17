import Navbar from './Components/Sections/Navbar';
import Hero from './Components/Sections/Hero';
import About from './Components/Sections/About';
import SkillStack from './Components/Sections/SkillStack';
import Career from './Components/Sections/Career';
import Projects from './Components/Sections/Projects';
import Contact from './Components/Sections/Contact';
import Footer from './Components/Sections/Footer';
import MouseSpotlight from './Components/MouseSpotlight';
import { getContent } from '@/lib/db';

export const revalidate = 60; // ISR: regenerate page every 60 seconds

export default async function Home() {
  const content = await getContent();

  // Sort sections by order
  const sortedSections = Object.values(content)
    .filter((s: any) => s._meta && SECTION_COMPONENTS[s._meta.key])
    .sort((a: any, b: any) => a._meta.order - b._meta.order);

  // Generate navbar links (exclude hero)
  const navLinks = sortedSections
    .filter((s: any) => s._meta.key !== 'hero' && s._meta.navTitle && s._meta.slug)
    .map((s: any) => ({ name: s._meta.navTitle, href: `#${s._meta.slug}` }));

  // Numbered sections for index calculation
  const numberedSections = sortedSections.filter((s: any) => s._meta.key !== 'hero');

  return (
    <div className='bg-zinc-950 snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth'>
      <Navbar links={navLinks} />

      {sortedSections.map((section: any) => {
        const Component = SECTION_COMPONENTS[section._meta.key];
        if (!Component) return null;

        const isHero = section._meta.key === 'hero';
        const index = isHero ? undefined : numberedSections.findIndex((s: any) => s._meta.key === section._meta.key) + 1;

        return <Component key={section._meta.key} data={section} id={section._meta.slug} index={index} />;
      })}

      <div className='snap-start'>
        <Footer />
      </div>

      <MouseSpotlight />
    </div>
  );
}

const SECTION_COMPONENTS: Record<string, any> = {
  hero: Hero,
  about: About,
  projects: Projects,
  skills: SkillStack,
  career: Career,
  contact: Contact,
};
