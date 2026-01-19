'use client';

import { useState, useEffect } from 'react';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  socials: SocialLink[];
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
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        email: initialData.email || '',
        socials: initialData.socials || [],
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

  const addSocial = () => {
    setFormData({
      ...formData,
      socials: [...formData.socials, { platform: '', url: '' }]
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

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>Contact Section</h2>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Section Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., Get in Touch'
          required
        />
      </div>

      {/* Subtitle Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Subtitle</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors min-h-[80px]'
          placeholder='Brief description...'
        />
      </div>

      {/* Email Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Contact Email</label>
        <input
          type='email'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='your@email.com'
          required
        />
      </div>

      {/* Social Links */}
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <label className='text-white text-sm font-bold'>Social Media Links</label>
          <button
            type='button'
            onClick={addSocial}
            className='text-blue-400 hover:text-blue-300 text-sm font-bold'
          >
            + Add Link
          </button>
        </div>

        {formData.socials.map((social, index) => (
          <div key={index} className='flex gap-4 items-start bg-neutral-800/50 p-4 rounded border border-neutral-700'>
            <div className='flex-1 flex flex-col gap-2'>
              <input
                type='text'
                value={social.platform}
                onChange={(e) => updateSocial(index, 'platform', e.target.value)}
                className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm'
                placeholder='Platform (e.g., GitHub, LinkedIn)'
              />
              <input
                type='url'
                value={social.url}
                onChange={(e) => updateSocial(index, 'url', e.target.value)}
                className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm'
                placeholder='URL (https://...)'
              />
            </div>
            <button
              type='button'
              onClick={() => removeSocial(index)}
              className='text-red-400 hover:text-red-300 p-2'
              title='Remove link'
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        type='submit'
        disabled={saving}
        className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4'
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
