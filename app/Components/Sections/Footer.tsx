import { Fira_Mono } from 'next/font/google';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400'],
});

export default function Footer() {
  return (
    <footer className={`${firaMono.className} w-full py-8 bg-black/50 text-center text-neutral-500`}>
      <p>&copy; {new Date().getFullYear()} Dominik Czekański. All rights reserved.</p>
      <p className="text-sm mt-2">Built with Next.js, Payload CMS, and Tailwind CSS.</p>
    </footer>
  );
}
