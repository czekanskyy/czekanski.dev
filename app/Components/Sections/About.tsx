import { Fira_Mono } from 'next/font/google';
import Image from 'next/image';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function About() {
  return (
    <div id='about' className={`min-h-screen ${firaMono.className} flex flex-col w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#1</span> About Me
      </h2>
      <div className='grid grid-cols-4 gap-12 items-center'>
        <div className='col-span-1 relative w-full aspect-square max-w-md mx-auto bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800'>
          <Image src='/placeholder_profile_pic.png' alt='Dominik' fill className='object-cover' />
        </div>
        <div className='col-span-3 flex flex-col gap-6 text-justify text-neutral-400 text-lg leading-relaxed'>
          <p>
            I&apos;m Dominik, a passionate Front End & WordPress Developer dedicated to crafting immersive and functional web experiences. With a strong
            foundation in modern web technologies like React, Next.js, and TypeScript, I bridge the gap between design and engineering.
          </p>
          <p>
            My journey involves not just writing code, but solving problems and optimizing performance. Whether it&apos;s building a custom WordPress theme from
            scratch or developing a complex single-page application, I focus on clean, maintainable code and user-centric design.
          </p>
          <p>
            When I&apos;m not coding, you can find me exploring the latest tech trends, contributing to open-source projects, or refining my skill stack to stay
            ahead in the ever-evolving digital landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
