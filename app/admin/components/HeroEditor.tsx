'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  image?: string;
}

interface HeroEditorProps {
  initialData?: HeroData;
  onSave: (data: HeroData) => Promise<void>;
}

export default function HeroEditor({ initialData, onSave }: HeroEditorProps) {
  const [formData, setFormData] = useState<HeroData>({
    name: '',
    title: '',
    subtitle: '',
    image: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        image: initialData.image || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>Hero Section</h2>

      {/* Name Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Name</label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., Dominik Czekański'
          required
        />
      </div>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., Full Stack Developer'
          required
        />
      </div>

      {/* Subtitle Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Subtitle</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors min-h-[100px]'
          placeholder='Short description or tagline...'
          required
        />
      </div>

      {/* Hero Image Upload */}
      <ImageUpload
        currentImage={formData.image}
        onImageChange={(url) => setFormData({ ...formData, image: url })}
        label='Hero Image'
      />

      {/* Save Button */}
      <button
        type='submit'
        disabled={saving}
        className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
