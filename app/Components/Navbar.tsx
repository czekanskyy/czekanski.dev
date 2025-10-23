import { Fira_Mono } from 'next/font/google';
import Link from 'next/link';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Navbar() {
  return (
    <nav
      className={`${firaMono.className} fixed top-0 left-0 w-full h-24 mask-b-from-80% bg-black/25 backdrop-blur-sm flex items-center justify-between px-8 text-white }`}
    >
      <p className='text-2xl cursor-default'>
        czekanski.dev{' '}
        <span className='text-blue-400'>
          &gt;
          <span className='anim-blinking'>_</span>
        </span>
      </p>
      <div className='flex justify-between space-x-4 text-md'>
        {links.map(link => (
          <Link href={link.href} key={link.text} className='hover:text-blue-400 transition-all duration-150 p-1'>
            {link.text}
            <span className='text-blue-400'>()</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

const links = [
  {
    text: 'myProjects',
    href: '#projects',
  },
  {
    text: 'skillStack',
    href: '#skills',
  },
  {
    text: 'myExperience',
    href: '#experience',
  },
  {
    text: 'aboutMe',
    href: '#about',
  },
  {
    text: 'contactMe',
    href: '#contact',
  },
];
