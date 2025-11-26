import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function Hero() {
  return (
    <div className={`h-screen ${inter.className} relative flex flex-col items-center justify-center text-center overflow-hidden bg-[#09090B] snap-start`}>
      {/* Background Video */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none select-none'>
        <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover blur-sm brightness-[0.4]'>
          <source src='/background.mp4' type='video/mp4' />
        </video>
      </div>

      <div className='z-10 flex flex-col items-center gap-2'>
        <h2 className='text-3xl font-medium text-neutral-400'>Hi, I&apos;m</h2>
        <h1 className='text-9xl font-black text-white tracking-tighter uppercase'>Dominik</h1>
        <p className='text-2xl font-bold text-neutral-500 uppercase tracking-widest mt-4'>Front End & WordPress Developer</p>
      </div>
    </div>
  );
}
