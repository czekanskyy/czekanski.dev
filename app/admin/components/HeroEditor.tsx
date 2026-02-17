'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface HeroData {
  // Site-wide settings
  pageTitle: string;
  pageDescription: string;
  favicon?: string;
  backgroundDesktop?: string;
  backgroundMobile?: string;
  // Legacy fields kept for backward compatibility with frontend Hero component
  name?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  _meta?: any;
}

interface HeroEditorProps {
  initialData?: HeroData;
  onSave: (data: HeroData) => Promise<void>;
}

export default function HeroEditor({ initialData, onSave }: HeroEditorProps) {
  const [formData, setFormData] = useState<HeroData>({
    pageTitle: '',
    pageDescription: '',
    favicon: '',
    backgroundDesktop: '',
    backgroundMobile: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        pageTitle: initialData.pageTitle || '',
        pageDescription: initialData.pageDescription || '',
        favicon: initialData.favicon || '',
        backgroundDesktop: initialData.backgroundDesktop || initialData.image || '',
        backgroundMobile: initialData.backgroundMobile || '',
        // Preserve legacy fields
        name: initialData.name,
        title: initialData.title,
        subtitle: initialData.subtitle,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave: HeroData = {
        ...formData,
        // Map desktop background to image for frontend compatibility
        image: formData.backgroundDesktop,
        _meta: {
          title: 'Hero Section',
          navTitle: 'Home',
          slug: 'hero',
          order: initialData?._meta?.order ?? 0,
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
        <h2 className='text-2xl font-bold text-foreground'>Site & Hero Settings</h2>
        <p className='text-sm text-muted-foreground mt-1'>Configure page metadata and the hero section background.</p>
      </div>

      {/* SEO / Browser Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Page Metadata</CardTitle>
          <CardDescription>These settings affect how your site appears in the browser tab and search results.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='page-title'>Page Title</Label>
            <Input
              id='page-title'
              value={formData.pageTitle}
              onChange={e => setFormData({ ...formData, pageTitle: e.target.value })}
              placeholder='e.g., Dominik Czekański 👨🏻‍💻'
            />
            <p className='text-[0.8rem] text-muted-foreground'>Displayed in the browser tab.</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='page-description'>Page Description</Label>
            <Textarea
              id='page-description'
              value={formData.pageDescription}
              onChange={e => setFormData({ ...formData, pageDescription: e.target.value })}
              placeholder="e.g., Hi, I'm Dominik and I sincerely welcome you to my website!"
              rows={3}
            />
            <p className='text-[0.8rem] text-muted-foreground'>Used by search engines (Google, Bing) as page description.</p>
          </div>
        </CardContent>
      </Card>

      {/* Favicon */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Favicon</CardTitle>
          <CardDescription>The small icon displayed in the browser tab next to the page title.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload currentImage={formData.favicon} onImageChange={url => setFormData({ ...formData, favicon: url })} label='Favicon' />
        </CardContent>
      </Card>

      {/* Background Media */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Background Media</CardTitle>
          <CardDescription>Upload separate backgrounds for desktop and mobile devices.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label>Desktop Background</Label>
            <p className='text-[0.8rem] text-muted-foreground'>Displayed on screens wider than 768px.</p>
            <ImageUpload
              currentImage={formData.backgroundDesktop}
              onImageChange={url => setFormData({ ...formData, backgroundDesktop: url })}
              label='Desktop Image / Video'
              acceptVideo
            />
          </div>
          <div className='space-y-2'>
            <Label>Mobile Background</Label>
            <p className='text-[0.8rem] text-muted-foreground'>Displayed on screens up to 768px. If empty, the desktop background will be used.</p>
            <ImageUpload
              currentImage={formData.backgroundMobile}
              onImageChange={url => setFormData({ ...formData, backgroundMobile: url })}
              label='Mobile Image / Video'
              acceptVideo
            />
          </div>
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
