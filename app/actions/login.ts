'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { readJSONFile } from '@/lib/db';
import { User, verifyPassword, generateToken } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Read users from file
  const users = await readJSONFile<{ users: User[] }>('users.json');

  if (!users || !users.users) {
    return { error: 'Authentication system not initialized' };
  }

  // Find user by email
  const user = users.users.find((u) => u.email === email);

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { error: 'Invalid credentials' };
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Redirect to admin dashboard (throws NEXT_REDIRECT which is expected)
  redirect('/admin');
}
