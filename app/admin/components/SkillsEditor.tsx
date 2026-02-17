'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, X, Plus, Trash2 } from 'lucide-react';

import SectionSettings, { SectionMetadata } from './SectionSettings';

interface SkillCategory {
  category: string;
  items: string[];
}

interface SkillsData {
  title: string; // Deprecated: managed by SectionSettings
  subtitle: string; // Deprecated: managed by SectionSettings
  categories: SkillCategory[];
  _meta?: any;
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

  const [metadata, setMetadata] = useState<SectionMetadata>({
    title: '',
    navTitle: '',
    slug: '',
  });

  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        categories: initialData.categories || [],
      });

      if (initialData._meta) {
        setMetadata({
          title: initialData._meta.title || 'Skills',
          navTitle: initialData._meta.navTitle || 'Skills',
          slug: initialData._meta.slug || 'skills',
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

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setFormData({
        ...formData,
        categories: [...formData.categories, { category: newCategoryName.trim(), items: [] }],
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>Skills Section</h2>
        <p className='text-sm text-muted-foreground mt-1'>Manage your skill categories and technologies.</p>
      </div>

      <SectionSettings metadata={metadata} onChange={setMetadata} />

      {/* Skill Categories */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Categories</h3>
        </div>

        {formData.categories.map((category, catIndex) => (
          <Card key={catIndex}>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <Input
                  value={category.category}
                  onChange={e => updateCategoryName(catIndex, e.target.value)}
                  className='font-semibold flex-1'
                  placeholder='Category Name'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeCategory(catIndex)}
                  className='text-muted-foreground hover:text-destructive shrink-0'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex flex-wrap gap-2'>
                {category.items.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant='secondary' className='gap-1 pr-1'>
                    {skill}
                    <button
                      type='button'
                      onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                      className='ml-1 hover:text-destructive transition-colors rounded-full'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
                {category.items.length === 0 && <p className='text-sm text-muted-foreground'>No skills added yet.</p>}
              </div>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add skill...'
                  className='flex-1'
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillToCategory(catIndex, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={e => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addSkillToCategory(catIndex, input.value);
                    input.value = '';
                  }}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Category */}
        <Card className='border-dashed'>
          <CardContent className='pt-6'>
            <div className='flex gap-2'>
              <Input
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder='New Category Name...'
                className='flex-1'
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
              />
              <Button type='button' variant='outline' onClick={addCategory}>
                <Plus className='h-4 w-4 mr-2' />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
