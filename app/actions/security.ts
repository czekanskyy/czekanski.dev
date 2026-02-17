'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updatePassword(prevState: any, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' };
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters long' };
  }

  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return { error: 'Incorrect current password' };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordHash },
    });

    revalidatePath('/admin');
    return { success: 'Password updated successfully' };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { error: 'An unexpected error occurred' };
  }
}
