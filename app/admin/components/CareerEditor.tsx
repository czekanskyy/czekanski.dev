'use client';

import { useState, useEffect } from 'react';
import QuillEditor from './QuillEditor';

interface CareerItem {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

interface CareerData {
  title: string;
  subtitle: string;
  items: CareerItem[];
}

interface CareerEditorProps {
  initialData?: CareerData;
  onSave: (data: CareerData) => Promise<void>;
}

export default function CareerEditor({ initialData, onSave }: CareerEditorProps) {
  const [formData, setFormData] = useState<CareerData>({
    title: '',
    subtitle: '',
    items: [],
  });
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        items: initialData.items || [],
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

  const addItem = () => {
    const newItem: CareerItem = {
      title: 'New Position',
      company: '',
      period: '',
      description: '',
      technologies: [],
    };
    setFormData({
      ...formData,
      items: [newItem, ...formData.items],
    });
    setExpandedIndex(0);
  };

  const removeItem = (index: number) => {
    if (confirm('Are you sure you want to delete this position?')) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData({ ...formData, items: newItems });
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const updateItem = (index: number, field: keyof CareerItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addTech = (itemIndex: number, tech: string) => {
    if (!tech.trim()) return;
    const newItems = [...formData.items];
    if (!newItems[itemIndex].technologies.includes(tech.trim())) {
      newItems[itemIndex].technologies.push(tech.trim());
      setFormData({ ...formData, items: newItems });
    }
  };

  const removeTech = (itemIndex: number, techIndex: number) => {
    const newItems = [...formData.items];
    newItems[itemIndex].technologies.splice(techIndex, 1);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>Career Section</h2>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Section Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., Experience'
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

      {/* Career Items List */}
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <label className='text-white text-sm font-bold'>Positions</label>
          <button
            type='button'
            onClick={addItem}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm'
          >
            + Add Position
          </button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className='bg-neutral-800/50 border border-neutral-700 rounded overflow-hidden'>
            {/* Header */}
            <div 
              className='flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-800 transition-colors'
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className='flex flex-col'>
                <h3 className='text-white font-bold'>{item.title || 'Untitled Position'}</h3>
                <span className='text-neutral-400 text-sm'>{item.company}</span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                  className='text-red-400 hover:text-red-300 text-sm'
                >
                  Delete
                </button>
                <span className='text-neutral-400'>
                  {expandedIndex === index ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedIndex === index && (
              <div className='p-4 border-t border-neutral-700 flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm'>Job Title</label>
                    <input
                      type='text'
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm'>Company</label>
                    <input
                      type='text'
                      value={item.company}
                      onChange={(e) => updateItem(index, 'company', e.target.value)}
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Period</label>
                  <input
                    type='text'
                    value={item.period}
                    onChange={(e) => updateItem(index, 'period', e.target.value)}
                    className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                    placeholder='e.g., 2020 - Present'
                  />
                </div>

                {/* Description (WYSIWYG) */}
                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Description</label>
                  <div className='bg-white rounded overflow-hidden text-black'>
                    <QuillEditor
                      value={item.description}
                      onChange={(content) => updateItem(index, 'description', content)}
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Technologies Used</label>
                  <div className='flex flex-wrap gap-2'>
                    {item.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className='bg-purple-900/50 text-purple-200 px-2 py-1 rounded text-sm flex items-center gap-2'>
                        <span>{tech}</span>
                        <button
                          type='button'
                          onClick={() => removeTech(index, techIndex)}
                          className='hover:text-red-300'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      placeholder='Add technology...'
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm flex-1'
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTech(index, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addTech(index, input.value);
                        input.value = '';
                      }}
                      className='bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded text-sm'
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
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
