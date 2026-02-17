'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface SectionMetadata {
  title: string;
  navTitle: string;
  slug: string;
}

interface SectionSettingsProps {
  metadata: SectionMetadata;
  onChange: (metadata: SectionMetadata) => void;
}

export default function SectionSettings({ metadata, onChange }: SectionSettingsProps) {
  const handleChange = (field: keyof SectionMetadata, value: string) => {
    onChange({
      ...metadata,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>General Settings</CardTitle>
        <CardDescription>Configure how this section appears in the dashboard and navigation.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='section-title'>Section Title</Label>
            <Input id='section-title' value={metadata.title || ''} onChange={e => handleChange('title', e.target.value)} placeholder='e.g., About Me' />
            <p className='text-[0.8rem] text-muted-foreground'>This title will be displayed in the section header on the website (e.g. #1 About Me).</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='section-nav-title'>Navbar Title</Label>
            <Input id='section-nav-title' value={metadata.navTitle || ''} onChange={e => handleChange('navTitle', e.target.value)} placeholder='e.g., About' />
            <p className='text-[0.8rem] text-muted-foreground'>Text displayed in the navigation menu.</p>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='section-slug'>Section Slug (ID)</Label>
          <Input id='section-slug' value={metadata.slug || ''} onChange={e => handleChange('slug', e.target.value)} placeholder='e.g., about' />
          <p className='text-[0.8rem] text-muted-foreground'>Unique ID used for URL anchors (e.g., #about). changing this might break external links.</p>
        </div>
      </CardContent>
    </Card>
  );
}
