import Navbar from './Components/Sections/Navbar';
import Hero from './Components/Sections/Hero';
import About from './Components/Sections/About';
import SkillStack from './Components/Sections/SkillStack';
import Experience from './Components/Sections/Experience';
import Projects from './Components/Sections/Projects';
import Contact from './Components/Sections/Contact';
import Footer from './Components/Sections/Footer';

export default function Home() {
  return (
    <div className='bg-[#09090B] snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth'>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <SkillStack />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}
