'use client';

import { Fira_Code } from 'next/font/google';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [socialLinks, setSocialLinks] = useState<any[] | null>(null);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    // Fetch contact content from CMS
    fetch('/api/content/contact')
      .then((res) => res.json())
      .then((data) => {
        setSocialLinks(data.socialLinks || []);
        setDescription(data.description || "I'm currently open to new opportunities.");
      })
      .catch(() => {
        // Fallback data
        setSocialLinks([
          { platform: 'GitHub', url: 'https://github.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' },
          { platform: 'Twitter', url: 'https://twitter.com' },
        ]);
        setDescription("I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!");
      });
  }, []);

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await sendEmail(formData);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  if (!socialLinks) {
    return (
      <div className={`min-h-screen ${firaCode.className} flex items-center justify-center`}>
        <p className='text-white'>Loading...</p>
      </div>
    );
  }

  return (
    <div id='contact' className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#5</span> Contact
      </h2>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        <div className='flex flex-col gap-6'>
          <p className='text-neutral-400 text-lg leading-relaxed'>{description}</p>
          <div className='flex flex-col gap-4 mt-4'>
            <h3 className='text-xl text-white font-bold'>Find me on:</h3>
            <div className='flex gap-4'>
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.url} target='_blank' className='text-neutral-400 hover:text-blue-400 transition-colors'>
                  {link.platform}
                </Link>
              ))}
            </div>
          </div>
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
                maxLength={2000}
                rows={5}
                className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors resize-none'
              ></textarea>
              <span className='text-neutral-500 text-xs text-right'>Max 2000 characters</span>
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
