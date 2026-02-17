import { Fira_Code } from 'next/font/google';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400'],
});

export default function Footer() {
  return (
    <footer className={`${firaCode.className} w-full p-8 bg-black/50 text-center text-neutral-500 text-sm`}>
      <div className='flex flex-col lg:flex-row justify-between max-w-[1200px] mx-auto space-y-2'>
        <span>&copy; {new Date().getFullYear()} Dominik Czekański. All rights reserved.</span>
        <span>
          Built with ❤️ using{' '}
          <a href='https://nextjs.org/' target='_blank' rel='noopener noreferrer' className='text-neutral-300 hover:text-neutral-100'>
            Next.js
          </a>{' '}
          and{' '}
          <a href='https://tailwindcss.com/' target='_blank' rel='noopener noreferrer' className='text-neutral-300 hover:text-neutral-100'>
            Tailwind CSS
          </a>
          .
        </span>
      </div>
    </footer>
  );
}
