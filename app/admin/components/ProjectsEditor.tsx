'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import QuillEditor from './QuillEditor';

interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  github?: string;
}

interface ProjectsData {
  title: string;
  subtitle: string;
  items: Project[];
}

interface ProjectsEditorProps {
  initialData?: ProjectsData;
  onSave: (data: ProjectsData) => Promise<void>;
}

export default function ProjectsEditor({ initialData, onSave }: ProjectsEditorProps) {
  const [formData, setFormData] = useState<ProjectsData>({
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

  const addProject = () => {
    const newProject: Project = {
      title: 'New Project',
      description: '',
      tags: [],
    };
    setFormData({
      ...formData,
      items: [newProject, ...formData.items],
    });
    setExpandedIndex(0); // Expand the new project
  };

  const removeProject = (index: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData({ ...formData, items: newItems });
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addTag = (projectIndex: number, tag: string) => {
    if (!tag.trim()) return;
    const newItems = [...formData.items];
    if (!newItems[projectIndex].tags.includes(tag.trim())) {
      newItems[projectIndex].tags.push(tag.trim());
      setFormData({ ...formData, items: newItems });
    }
  };

  const removeTag = (projectIndex: number, tagIndex: number) => {
    const newItems = [...formData.items];
    newItems[projectIndex].tags.splice(tagIndex, 1);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-white'>Projects Section</h2>

      {/* Title Input */}
      <div className='flex flex-col gap-2'>
        <label className='text-white text-sm font-bold'>Section Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className='bg-neutral-800 border border-neutral-700 rounded p-3 text-white focus:border-blue-400 focus:outline-none transition-colors'
          placeholder='e.g., My Projects'
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

      {/* Projects List */}
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <label className='text-white text-sm font-bold'>Projects</label>
          <button
            type='button'
            onClick={addProject}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm'
          >
            + Add Project
          </button>
        </div>

        {formData.items.map((project, index) => (
          <div key={index} className='bg-neutral-800/50 border border-neutral-700 rounded overflow-hidden'>
            {/* Project Header (Click to Expand) */}
            <div 
              className='flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-800 transition-colors'
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <h3 className='text-white font-bold'>{project.title || 'Untitled Project'}</h3>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(index);
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
                {/* Project Title */}
                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Project Title</label>
                  <input
                    type='text'
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                  />
                </div>

                {/* Project Description (WYSIWYG) */}
                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Description</label>
                  <div className='bg-white rounded overflow-hidden text-black'>
                    <QuillEditor
                      value={project.description}
                      onChange={(content) => updateProject(index, 'description', content)}
                    />
                  </div>
                </div>

                {/* Project Image */}
                <ImageUpload
                  currentImage={project.image}
                  onImageChange={(url) => updateProject(index, 'image', url)}
                  label='Project Image'
                />

                {/* Links */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm'>Live Link</label>
                    <input
                      type='url'
                      value={project.link || ''}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                      placeholder='https://...'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm'>GitHub Link</label>
                    <input
                      type='url'
                      value={project.github || ''}
                      onChange={(e) => updateProject(index, 'github', e.target.value)}
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white'
                      placeholder='https://github.com/...'
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className='flex flex-col gap-2'>
                  <label className='text-white text-sm'>Technologies / Tags</label>
                  <div className='flex flex-wrap gap-2'>
                    {project.tags.map((tag, tagIndex) => (
                      <div key={tagIndex} className='bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-sm flex items-center gap-2'>
                        <span>{tag}</span>
                        <button
                          type='button'
                          onClick={() => removeTag(index, tagIndex)}
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
                      placeholder='Add tag...'
                      className='bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm flex-1'
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(index, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addTag(index, input.value);
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
