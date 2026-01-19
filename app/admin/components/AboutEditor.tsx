'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import QuillEditor from './QuillEditor';

interface AboutData {
  title: string;
  bio: string;
  profileImage?: string;
  highlightedSkills?: string[];
}

interface AboutEditorProps {
  initialData?: AboutData;
  onSave: (data: AboutData) => Promise<void>;
}

export default function AboutEditor({ initialData, onSave }: AboutEditorProps) {
  const [formData, setFormData] = useState<AboutData>({
    title: '',
    bio: '',
    profileImage: '',
    highlightedSkills: [],
  });
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        bio: initialData.bio || '',
        profileImage: initialData.profileImage || '',
        highlightedSkills: initialData.highlightedSkills || [],
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

  const addSkill = () => {
    if (newSkill.trim() && !formData.highlightedSkills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        highlightedSkills: [...(formData.highlightedSkills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      highlightedSkills: formData.highlightedSkills?.filter((s) => s !== skill),
    });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>About Section</h2>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Section Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., About Me'
          required
        />
      </div>

      {/* Bio - WYSIWYG Editor */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Bio</label>
        <div className='bg-white rounded overflow-hidden text-black'>
          <QuillEditor
            value={formData.bio}
            onChange={(content) => setFormData({ ...formData, bio: content })}
            className='min-h-[200px]'
          />
        </div>
      </div>

      {/* Profile Image Upload */}
      <ImageUpload
        currentImage={formData.profileImage}
        onImageChange={(url) => setFormData({ ...formData, profileImage: url })}
        label='Profile Image'
      />

      {/* Highlighted Skills */}
      <div className='flex flex-col gap-3'>
        <label className='text-white text-sm font-bold'>Highlighted Skills (Optional)</label>
        
        {/* Skill List */}
        <div className='flex flex-wrap gap-2'>
          {formData.highlightedSkills?.map((skill) => (
            <div
              key={skill}
              className='bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2'
            >
              <span>{skill}</span>
              <button
                type='button'
                onClick={() => removeSkill(skill)}
                className='hover:text-red-300 transition-colors'
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Skill Input */}
        <div className='flex gap-2'>
          <input
            type='text'
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className='flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:border-blue-400 focus:outline-none transition-colors'
            placeholder='Add a skill...'
          />
          <button
            type='button'
            onClick={addSkill}
            className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded transition-colors'
          >
            Add
          </button>
        </div>
      </div>

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
