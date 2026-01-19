import { Fira_Code } from 'next/font/google';
import Image from 'next/image';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

async function getAboutContent() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/content/about`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    return {
      profileImage: '/profile.jpg',
      paragraph1: '"Hello there." I\'m Dominik, a Web Developer specializing in WordPress & Next.js.',
      paragraph2: 'My focus goes beyond writing lines of code; I architect solutions that are clean, maintainable, and reliable.',
    };
  }
}

export default async function About() {
  const content = await getAboutContent();

  return (
    <div id='about' className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#1</span> About Me
      </h2>
      <div className='flex flex-col md:grid grid-cols-12 gap-12 items-start'>
        <div className='hidden md:block md:col-span-5 lg:col-span-4 xl:col-span-3 relative w-full aspect-3/4 max-w-md mx-auto bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10 shadow-white/25 sepia-[0.25]'>
          <Image src={content.profileImage || '/profile.jpg'} alt='A very cool photo of me piloting an aircraft 😎' fill className='object-cover' />
        </div>
        <div className='md:col-span-7 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 text-justify text-neutral-400 text-lg leading-relaxed'>
          <p>{content.paragraph1}</p>
          <p>{content.paragraph2}</p>
        </div>
      </div>
    </div>
  );
}
