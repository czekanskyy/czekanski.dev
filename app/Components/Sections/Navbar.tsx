import { Fira_Mono } from 'next/font/google';
import Link from 'next/link';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const navLinks = [
  { name: 'aboutMe', href: '#about' },
  { name: 'projects', href: '#projects' },
  { name: 'skills', href: '#skills' },
  { name: 'experience', href: '#experience' },
  { name: 'contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <nav className={`fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-sm border-b border-neutral-800 ${firaMono.className}`}>
      <div className='max-w-[1200px] mx-auto px-8 h-20 flex items-center justify-between'>
        <Link href='/' className='text-2xl text-white hover:text-blue-400 transition-colors'>
          czekanski.dev{' '}
          <span className='text-blue-400'>
            &gt;<span className='animate-blink'>_</span>
          </span>
        </Link>

        <div className='flex gap-8'>
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className='text-neutral-400 hover:text-blue-400 transition-colors'>
              {link.name}
              <span className='text-blue-400'>();</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
