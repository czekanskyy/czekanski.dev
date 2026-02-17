'use client';

import { Fira_Code } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';
import { FileText } from 'lucide-react';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactData {
  title?: string;
  subtitle?: string; // Used as description
  email?: string;
  socials?: SocialLink[]; // Backend uses socials
  socialLinks?: SocialLink[]; // Fallback
  resumeUrl?: string;
  _meta?: {
    title?: string;
    navTitle?: string;
    slug?: string;
  };
}

interface ContactProps {
  data: ContactData | null;
  id?: string;
  index?: number;
}

export default function Contact({ data, id, index }: ContactProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle both socials (backend) and socialLinks (legacy/fallback)
  const links = data?.socials || data?.socialLinks;
  const socialLinks = links?.length
    ? links
    : [
        { platform: 'GitHub', url: 'https://github.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
      ];

  const description =
    data?.subtitle || "I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!";

  const sectionTitle = data?._meta?.title || 'Contact';

  const resumeUrl = data?.resumeUrl;
  // Extract original filename without timestamp prefix and extension
  // Upload format: "1234567890-OriginalName.pdf" -> "OriginalName"
  const resumeLabel = resumeUrl
    ? decodeURIComponent(resumeUrl.split('/').pop() || '')
        .replace(/^\d+-/, '')
        .replace(/\.[^.]+$/, '')
    : '';

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await sendEmail(formData);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  // Loading check removed as data is passed via props

  return (
    <div id={id || 'contact'} className={`min-h-screen snap-start ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center`}>
      <h2 className='text-3xl md:text-5xl text-white font-bold mb-12'>
        {index && <span className='text-2xl text-blue-400'>#{index}</span>} {sectionTitle}
      </h2>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        <div className='flex flex-col gap-6'>
          <p className='text-neutral-400 text-lg leading-relaxed'>{description}</p>
          <div className='flex flex-col gap-4 mt-4'>
            <h3 className='text-xl text-white font-bold'>Find me on:</h3>
            <div className='flex'>
              {socialLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  target='_blank'
                  className='text-neutral-400 hover:text-blue-400 transition-colors border-l first:border-0 px-4 border-neutral-400 first:pl-0 last:pr-0'
                >
                  {link.platform}
                </Link>
              ))}
            </div>
          </div>
          {resumeUrl && (
            <div className='flex flex-col gap-4 mt-4'>
              <h3 className='text-xl text-white font-bold'>Check my resume:</h3>
              <Link
                href={resumeUrl}
                target='_blank'
                className='p-4 border border-neutral-800 hover:border-neutral-400 rounded-lg w-fit text-sm flex items-center space-x-2 text-neutral-400 bg-neutral-900 transition-colors cursor-pointer'
              >
                <FileText className='h-4 w-4' />
                <span>{resumeLabel}</span>
              </Link>
            </div>
          )}
        </div>

        <div className='bg-neutral-900/50 p-8 rounded-lg border border-neutral-800'>
          <form action={handleSubmit} className='flex flex-col gap-6'>
            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='firstName' className='text-white text-sm font-bold'>
                  First Name *
                </label>
                <input
                  type='text'
                  name='firstName'
                  id='firstName'
                  required
                  className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='lastName' className='text-white text-sm font-bold'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  id='lastName'
                  className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='email' className='text-white text-sm font-bold'>
                Email Address *
              </label>
              <input
                type='email'
                name='email'
                id='email'
                required
                className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='message' className='text-white text-sm font-bold'>
                Message *
              </label>
              <textarea
                name='message'
                id='message'
                required
                maxLength={1337}
                rows={5}
                className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors resize-none'
              ></textarea>
              <span className='text-neutral-500 text-xs text-right'>Max 1337 characters</span>
            </div>

            <button
              type='submit'
              disabled={status === 'loading' || status === 'success'}
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
            </button>

            {status === 'success' && <p className='text-green-400 text-sm text-center'>Thank you! Your message has been sent successfully.</p>}
            {status === 'error' && <p className='text-red-400 text-sm text-center'>Something went wrong. Please try again later.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
