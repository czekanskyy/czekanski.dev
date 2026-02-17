'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import QuillEditor from './QuillEditor';

import SectionSettings, { SectionMetadata } from './SectionSettings';

interface AboutData {
  // Content fields
  title: string; // This is the visible title in the component "About Me"
  bio: string;
  profileImage?: string;

  // Metadata
  _meta?: any; // To hold raw meta from DB if needed
}

interface AboutEditorProps {
  initialData?: AboutData;
  onSave: (data: AboutData) => Promise<void>;
}

export default function AboutEditor({ initialData, onSave }: AboutEditorProps) {
  // Separate content data from metadata
  const [formData, setFormData] = useState<AboutData>({
    title: '',
    bio: '',
    profileImage: '',
  });

  const [metadata, setMetadata] = useState<SectionMetadata>({
    title: '',
    navTitle: '',
    slug: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        bio: initialData.bio || '',
        profileImage: initialData.profileImage || '',
      });

      // Extract metadata from initialData._meta if available
      if (initialData._meta) {
        setMetadata({
          title: initialData._meta.title || 'About',
          navTitle: initialData._meta.navTitle || 'About',
          slug: initialData._meta.slug || 'about',
        });
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Combine data and metadata
      const dataToSave = {
        ...formData,
        _meta: {
          ...metadata,
          order: initialData?._meta?.order ?? 0, // Preserve order
        },
      };
      await onSave(dataToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>About Section</h2>
        <p className='text-sm text-muted-foreground mt-1'>Edit your personal bio and profile information.</p>
      </div>

      <SectionSettings metadata={metadata} onChange={setMetadata} />

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Content</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='about-title'>Section Headline (H2)</Label>
            <Input id='about-title' value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder='e.g., About Me' />
          </div>

          <div className='space-y-2'>
            <Label>Bio</Label>
            <div className='bg-white rounded-md overflow-hidden text-black'>
              <QuillEditor value={formData.bio} onChange={content => setFormData({ ...formData, bio: content })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Profile Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload currentImage={formData.profileImage} onImageChange={url => setFormData({ ...formData, profileImage: url })} label='Profile Image' />
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button type='submit' disabled={saving}>
          {saving ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
