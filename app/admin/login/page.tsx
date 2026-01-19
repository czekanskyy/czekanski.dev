'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fira_Code } from 'next/font/google';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setLoading(false);
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen bg-zinc-950 flex items-center justify-center p-8 ${firaCode.className}`}>
      <div className='w-full max-w-md'>
        <div className='bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Admin Login</h1>
          <p className='text-neutral-400 mb-8'>Enter your credentials to access the admin panel</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='email' className='text-white text-sm font-bold'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                required
                className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
                placeholder='admin@czekanski.dev'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='password' className='text-white text-sm font-bold'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                required
                className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
                placeholder='••••••••'
              />
            </div>

            {error && (
              <div className='bg-red-500/10 border border-red-500/50 rounded p-3 text-red-400 text-sm'>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className='mt-6 pt-6 border-t border-neutral-800'>
            <p className='text-neutral-500 text-sm'>
              Default credentials: admin@czekanski.dev / Admin123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
