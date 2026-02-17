'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Terminal, Loader2 } from 'lucide-react';

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
    <div className='dark min-h-screen bg-background flex items-center justify-center p-8'>
      <div className='w-full max-w-md'>
        <Card className='border-border/50'>
          <CardHeader className='space-y-1 text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Terminal className='h-6 w-6 text-primary' />
              <span className='text-lg font-mono font-bold text-foreground'>czekanski.dev</span>
            </div>
            <CardTitle className='text-2xl'>Admin Panel</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input type='email' id='email' name='email' required placeholder='admin@czekanski.dev' autoComplete='email' />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input type='password' id='password' name='password' required placeholder='••••••••' autoComplete='current-password' />
              </div>

              {error && <div className='bg-destructive/10 border border-destructive/30 rounded-md p-3 text-destructive text-sm text-center'>{error}</div>}

              <Button type='submit' disabled={loading} className='w-full mt-2'>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
