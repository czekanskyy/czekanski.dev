'use client';

import { Fira_Mono } from 'next/font/google';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const navLinks = [
  { name: 'aboutMe', href: '#about' },
  { name: 'projects', href: '#projects' },
  { name: 'skills', href: '#skills' },
  { name: 'career', href: '#career' },
  { name: 'contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-sm border-b border-neutral-800 ${firaMono.className}`}>
      <div className='max-w-[1200px] mx-auto px-8 h-20 flex items-center justify-between'>
        <Link href='/' className='text-sm lg:text-2xl text-white hover:text-blue-400 transition-colors'>
          czekanski.dev{' '}
          <span className='text-blue-400'>
            &gt;<span className='animate-blink'>_</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex gap-8'>
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className='text-xs lg:text-base text-neutral-400 hover:text-blue-400 transition-colors'>
              {link.name}
              <span className='text-blue-400'>();</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden text-white hover:text-blue-400 transition-colors cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className='absolute top-20 left-0 w-full bg-[#09090B] border-b border-neutral-800 md:hidden flex flex-col p-4 gap-4'>
            {navLinks.map((link, i) => (
              <Link key={i} href={link.href} className='text-base text-neutral-400 hover:text-blue-400 transition-colors py-2' onClick={() => setIsOpen(false)}>
                {link.name}
                <span className='text-blue-400'>();</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
