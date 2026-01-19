import { Poppins, Whisper } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const whisper = Whisper({
  subsets: ['latin'],
  weight: ['400'],
});

async function getHeroContent() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/content/hero`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    return {
      name: 'Dominik',
      jobTitle: 'Front End & WordPress Developer',
      backgroundVideo: '/background.mp4',
    };
  }
}

export default async function Hero() {
  const content = await getHeroContent();

  return (
    <div className={`h-screen ${poppins.className} relative flex flex-col items-center justify-center text-center overflow-hidden bg-[#09090B] snap-start`}>
      {/* Background Video */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none select-none'>
        <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover blur-md opacity-25'>
          <source src={content.backgroundVideo || '/background.mp4'} type='video/mp4' />
        </video>
        <div className='absolute inset-0 overflow-hidden w-full h-full object-cover bg-linear-to-t from-zinc-950 to-transparent' />
      </div>

      <div className='z-10 flex flex-col items-center gap-1 font-semibold'>
        <h2 className='text-2xl font-medium text-neutral-400'>Hi, I&apos;m</h2>
        <h1 className={`text-9xl font-black text-blue-400 tracking-tighter ${whisper.className}`}>{content.name}</h1>
        <p className='text-2xl text-neutral-400 uppercase'>{content.jobTitle}</p>
      </div>
    </div>
  );
}
