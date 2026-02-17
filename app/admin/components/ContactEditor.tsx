'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Plus, Trash2, Upload, FileText } from 'lucide-react';

import SectionSettings, { SectionMetadata } from './SectionSettings';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface ContactData {
  title: string; // Deprecated: managed by SectionSettings
  subtitle: string; // Deprecated: managed by SectionSettings
  email: string;
  socials: SocialLink[];
  resumeUrl?: string;
  _meta?: any;
}

interface ContactEditorProps {
  initialData?: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

export default function ContactEditor({ initialData, onSave }: ContactEditorProps) {
  const [formData, setFormData] = useState<ContactData>({
    title: '',
    subtitle: '',
    email: '',
    socials: [],
    resumeUrl: '',
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
        subtitle: initialData.subtitle || '',
        email: initialData.email || '',
        socials: initialData.socials || [],
        resumeUrl: initialData.resumeUrl || '',
      });

      if (initialData._meta) {
        setMetadata({
          title: initialData._meta.title || 'Contact',
          navTitle: initialData._meta.navTitle || 'Contact',
          slug: initialData._meta.slug || 'contact',
        });
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        _meta: {
          ...metadata,
          order: initialData?._meta?.order ?? 0,
        },
      };
      await onSave(dataToSave);
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setFormData({
      ...formData,
      socials: [...formData.socials, { platform: '', url: '' }],
    });
  };

  const removeSocial = (index: number) => {
    const newSocials = [...formData.socials];
    newSocials.splice(index, 1);
    setFormData({ ...formData, socials: newSocials });
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setFormData({ ...formData, socials: newSocials });
  };

  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return;
    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setFormData(prev => ({ ...prev, resumeUrl: url }));
      }
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>Contact Section</h2>
        <p className='text-sm text-muted-foreground mt-1'>Configure your contact information and social links.</p>
      </div>

      <SectionSettings metadata={metadata} onChange={setMetadata} />

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='contact-email'>Contact Email</Label>
            <Input
              id='contact-email'
              type='email'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder='your@email.com'
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Social Links</CardTitle>
              <CardDescription>Add your social media profiles.</CardDescription>
            </div>
            <Button type='button' variant='outline' size='sm' onClick={addSocial}>
              <Plus className='h-4 w-4 mr-2' />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          {formData.socials.length === 0 && <p className='text-sm text-muted-foreground text-center py-4'>No social links added yet.</p>}
          {formData.socials.map((social, index) => (
            <div key={index} className='flex gap-3 items-start p-3 rounded-md border border-border bg-muted/30'>
              <div className='flex-1 space-y-2'>
                <Input
                  value={social.platform}
                  onChange={e => updateSocial(index, 'platform', e.target.value)}
                  placeholder='Platform (e.g., GitHub, LinkedIn)'
                />
                <Input type='url' value={social.url} onChange={e => updateSocial(index, 'url', e.target.value)} placeholder='URL (https://...)' />
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeSocial(index)}
                className='text-muted-foreground hover:text-destructive h-8 w-8 p-0 shrink-0 mt-1'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resume / CV */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Resume / CV</CardTitle>
          <CardDescription>Upload a PDF file. The filename (without extension) will be shown as the download button label.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {formData.resumeUrl && (
            <div className='flex items-center gap-3 p-3 rounded-md border border-border bg-muted/30'>
              <FileText className='h-5 w-5 text-muted-foreground shrink-0' />
              <span className='text-sm text-foreground flex-1 truncate'>{formData.resumeUrl.split('/').pop()}</span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setFormData({ ...formData, resumeUrl: '' })}
                className='text-muted-foreground hover:text-destructive h-8 w-8 p-0 shrink-0'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          )}
          <Button type='button' variant='outline' size='sm' asChild className='cursor-pointer'>
            <label>
              <input type='file' accept='application/pdf' onChange={handleResumeUpload} disabled={uploadingResume} className='hidden' />
              <Upload className='h-4 w-4 mr-2' />
              {uploadingResume ? 'Uploading...' : formData.resumeUrl ? 'Replace PDF' : 'Upload PDF'}
            </label>
          </Button>
          <p className='text-xs text-muted-foreground'>Supported: PDF only</p>
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
