'use client';

import { useState, useEffect } from 'react';

interface Skill {
  name: string;
  icon?: string; // Optional icon class or url
}

interface SkillCategory {
  category: string;
  items: string[]; // Array of skill names
}

interface SkillsData {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
}

interface SkillsEditorProps {
  initialData?: SkillsData;
  onSave: (data: SkillsData) => Promise<void>;
}

export default function SkillsEditor({ initialData, onSave }: SkillsEditorProps) {
  const [formData, setFormData] = useState<SkillsData>({
    title: '',
    subtitle: '',
    categories: [],
  });
  const [saving, setSaving] = useState(false);
  
  // State for new category
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        categories: initialData.categories || [],
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

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setFormData({
        ...formData,
        categories: [
          ...formData.categories,
          { category: newCategoryName.trim(), items: [] }
        ]
      });
      setNewCategoryName('');
    }
  };

  const removeCategory = (index: number) => {
    const newCategories = [...formData.categories];
    newCategories.splice(index, 1);
    setFormData({ ...formData, categories: newCategories });
  };

  const updateCategoryName = (index: number, name: string) => {
    const newCategories = [...formData.categories];
    newCategories[index].category = name;
    setFormData({ ...formData, categories: newCategories });
  };

  const addSkillToCategory = (categoryIndex: number, skillName: string) => {
    if (!skillName.trim()) return;
    const newCategories = [...formData.categories];
    if (!newCategories[categoryIndex].items.includes(skillName.trim())) {
      newCategories[categoryIndex].items.push(skillName.trim());
      setFormData({ ...formData, categories: newCategories });
    }
  };

  const removeSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const newCategories = [...formData.categories];
    newCategories[categoryIndex].items.splice(skillIndex, 1);
    setFormData({ ...formData, categories: newCategories });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>Skills Section</h2>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Section Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., Technical Skills'
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

      {/* Categories Management */}
      <div className='flex flex-col gap-4'>
        <label className='text-white text-sm font-bold'>Skill Categories</label>
        
        {formData.categories.map((category, catIndex) => (
          <div key={catIndex} className='bg-neutral-800/50 border border-neutral-700 rounded p-4 flex flex-col gap-4'>
            <div className='flex justify-between items-center gap-4'>
              <input
                type='text'
                value={category.category}
                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white flex-1 font-bold'
                placeholder='Category Name'
              />
              <button
                type='button'
                onClick={() => removeCategory(catIndex)}
                className='text-red-400 hover:text-red-300 text-sm'
              >
                Remove Category
              </button>
            </div>

            {/* Skills in Category */}
            <div className='flex flex-wrap gap-2'>
              {category.items.map((skill, skillIndex) => (
                <div key={skillIndex} className='bg-neutral-700 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm'>
                  <span>{skill}</span>
                  <button
                    type='button'
                    onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                    className='hover:text-red-300'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Add skill...'
                className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm flex-1'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillToCategory(catIndex, (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                type='button'
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  addSkillToCategory(catIndex, input.value);
                  input.value = '';
                }}
                className='bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded text-sm'
              >
                Add
              </button>
            </div>
          </div>
        ))}

        {/* Add New Category */}
        <div className='flex gap-2 mt-2'>
          <input
            type='text'
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder='New Category Name...'
            className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white flex-1'
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
          />
          <button
            type='button'
            onClick={addCategory}
            className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold'
          >
            Add Category
          </button>
        </div>
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
