import Navbar from './Components/Sections/Navbar';
import Hero from './Components/Sections/Hero';
import About from './Components/Sections/About';
import SkillStack from './Components/Sections/SkillStack';
import Career from './Components/Sections/Career';
import Projects from './Components/Sections/Projects';
import Contact from './Components/Sections/Contact';
import Footer from './Components/Sections/Footer';
import MouseSpotlight from './Components/MouseSpotlight';

export default function Home() {
  return (
    <div className='bg-zinc-950 snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth'>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <SkillStack />
      <Career />
      <Contact />
      <Footer />
      <MouseSpotlight />
    </div>
  );
}
