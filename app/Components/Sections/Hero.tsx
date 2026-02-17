import { Poppins, Whisper } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const whisper = Whisper({
  subsets: ['latin'],
  weight: ['400'],
});

interface HeroProps {
  data: {
    name?: string;
    jobTitle?: string;
    title?: string;
    subtitle?: string;
    backgroundVideo?: string;
    backgroundDesktop?: string;
    backgroundMobile?: string;
    image?: string;
  } | null;
  id?: string;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function BackgroundMedia({ src, className }: { src: string; className?: string }) {
  if (isVideo(src)) {
    const ext = src.split('.').pop()?.split('?')[0]?.toLowerCase();
    const mimeType = ext === 'webm' ? 'video/webm' : ext === 'ogg' ? 'video/ogg' : 'video/mp4';
    return (
      <video autoPlay loop muted playsInline className={`absolute inset-0 w-full h-full object-cover blur-md opacity-25 ${className || ''}`}>
        <source src={src} type={mimeType} />
      </video>
    );
  }
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-cover bg-center blur-xs opacity-30 scale-105 ${className || ''}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

export default function Hero({ data, id }: HeroProps) {
  const content = {
    name: data?.name || 'Dominik',
    jobTitle: data?.jobTitle || data?.title || 'Front End & WordPress Developer',
    subtitle: data?.subtitle,
    backgroundDesktop: data?.backgroundDesktop || data?.image,
    backgroundMobile: data?.backgroundMobile,
  };

  // Fallback: if no mobile background, use desktop
  const mobileMedia = content.backgroundMobile || content.backgroundDesktop;
  const desktopMedia = content.backgroundDesktop;

  return (
    <div className={`h-screen ${poppins.className} relative flex flex-col items-center justify-center text-center overflow-hidden bg-[#09090B] snap-start`}>
      {/* Background Media */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none select-none'>
        {desktopMedia || mobileMedia ? (
          <>
            {/* Desktop background (hidden on mobile) */}
            {desktopMedia && (
              <div className='hidden md:block absolute inset-0'>
                <BackgroundMedia src={desktopMedia} />
              </div>
            )}
            {/* Mobile background (hidden on desktop) */}
            {mobileMedia && (
              <div className='block md:hidden absolute inset-0'>
                <BackgroundMedia src={mobileMedia} />
              </div>
            )}
            <div className='absolute inset-0 overflow-hidden w-full h-full object-cover bg-linear-to-t from-zinc-950 to-transparent' />
          </>
        ) : (
          <>
            <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full object-cover blur-md opacity-25'>
              <source src='/background.mp4' type='video/mp4' />
            </video>
            <div className='absolute inset-0 overflow-hidden w-full h-full object-cover bg-linear-to-t from-zinc-950 to-transparent' />
          </>
        )}
      </div>

      <div className='z-10 flex flex-col items-center gap-1 font-semibold px-4'>
        <h2 className='text-2xl font-medium text-neutral-400'>Hi, I&apos;m</h2>
        <h1 className={`text-6xl md:text-9xl font-black text-blue-400 tracking-tighter ${whisper.className}`}>{content.name}</h1>
        <p className='text-xl md:text-2xl text-neutral-400 uppercase'>{content.jobTitle}</p>
        {content.subtitle && <p className='text-neutral-500 max-w-lg mt-4 text-sm md:text-base font-normal'>{content.subtitle}</p>}
      </div>
    </div>
  );
}
