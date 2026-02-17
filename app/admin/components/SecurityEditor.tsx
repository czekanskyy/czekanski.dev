'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { updatePassword } from '@/app/actions/security';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Updating Password...
        </>
      ) : (
        <>
          <Lock className='mr-2 h-4 w-4' />
          Update Password
        </>
      )}
    </Button>
  );
}

export default function SecurityEditor() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function clientAction(formData: FormData) {
    setMessage(null);
    const result = await updatePassword(null, formData);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result?.success) {
      setMessage({ type: 'success', text: result.success as string });
      // Reset form on success
      (document.getElementById('password-form') as HTMLFormElement)?.reset();
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Security Settings</h2>
        <p className='text-muted-foreground'>Manage your account security and password.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id='password-form' action={clientAction} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='currentPassword'>Current Password</Label>
              <Input id='currentPassword' name='currentPassword' type='password' required placeholder='••••••••' />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input id='newPassword' name='newPassword' type='password' required placeholder='••••••••' minLength={8} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <Input id='confirmPassword' name='confirmPassword' type='password' required placeholder='••••••••' minLength={8} />
              </div>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                  message.type === 'success' ? 'bg-green-500/15 text-green-500' : 'bg-destructive/15 text-destructive'
                }`}
              >
                {message.type === 'success' ? <CheckCircle className='h-4 w-4' /> : <AlertCircle className='h-4 w-4' />}
                {message.text}
              </div>
            )}

            <div className='flex justify-end pt-4'>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
