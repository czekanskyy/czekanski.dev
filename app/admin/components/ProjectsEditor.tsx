'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Save, X, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink, Github, GripVertical } from 'lucide-react';
import ImageUpload from './ImageUpload';

import SectionSettings, { SectionMetadata } from './SectionSettings';

import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  github?: string;
}

interface ProjectsData {
  title: string; // Keeping for backward compatibility but unused in UI
  subtitle: string; // Keeping for backward compatibility but unused in UI
  items: Project[];
  _meta?: any;
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

  const [metadata, setMetadata] = useState<SectionMetadata>({
    title: '',
    navTitle: '',
    slug: '',
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

      if (initialData._meta) {
        setMetadata({
          title: initialData._meta.title || 'Projects',
          navTitle: initialData._meta.navTitle || 'Projects',
          slug: initialData._meta.slug || 'projects',
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

  const addProject = () => {
    const newProject: Project = { title: 'New Project', description: '', tags: [] };
    // Add to top (Featured)
    setFormData({ ...formData, items: [newProject, ...formData.items] });
    setExpandedIndex(0);
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newItems = Array.from(formData.items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);

    setFormData({ ...formData, items: newItems });
    // Adjust expanded index if necessary
    if (expandedIndex !== null) {
      if (expandedIndex === sourceIndex) {
        setExpandedIndex(destinationIndex);
      } else if (expandedIndex === destinationIndex) {
        // Logic complicated for swapping around, simplest is to close or keep if not involved
        // If moved item was expanded -> destinationIndex
        // If expanded item was shifted -> adjust
        // For simplicity, let's close it to avoid bugs or keep simple logic
        setExpandedIndex(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>Projects Section</h2>
        <p className='text-sm text-muted-foreground mt-1'>Manage your portfolio projects. The first project in the list will be highlighted as 'Featured'.</p>
      </div>

      <SectionSettings metadata={metadata} onChange={setMetadata} />

      {/* Projects List with Drag & Drop */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Projects ({formData.items.length})</h3>
          <Button type='button' variant='outline' size='sm' onClick={addProject} className='text-white'>
            <Plus className='h-4 w-4 mr-2' />
            Add Project
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='projects-list'>
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                {formData.items.map((project, index) => (
                  <Draggable key={index} draggableId={`project-${index}`} index={index}>
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                        <Card className={`${snapshot.isDragging ? 'opacity-50 ring-2 ring-primary z-50' : ''}`}>
                          <Collapsible open={expandedIndex === index} onOpenChange={open => setExpandedIndex(open ? index : null)}>
                            <div className='flex items-center p-4'>
                              <div {...provided.dragHandleProps} className='mr-4 cursor-grab hover:text-foreground text-muted-foreground'>
                                <GripVertical className='h-5 w-5' />
                              </div>
                              <CollapsibleTrigger asChild className='flex-1'>
                                <div className='flex items-center justify-between cursor-pointer'>
                                  <div className='flex items-center gap-3'>
                                    <div className='flex flex-col items-start gap-1'>
                                      <CardTitle className='text-base'>{project.title || 'Untitled Project'}</CardTitle>
                                      {index === 0 && (
                                        <Badge variant='default' className='bg-blue-600 hover:bg-blue-700 text-xs'>
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                    {project.tags.length > 0 && (
                                      <span className='text-xs text-muted-foreground hidden sm:inline-block'>
                                        {project.tags.length} tag{project.tags.length !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={e => {
                                        e.stopPropagation();
                                        removeProject(index);
                                      }}
                                      className='text-muted-foreground hover:text-destructive h-8 w-8 p-0'
                                    >
                                      <Trash2 className='h-4 w-4' />
                                    </Button>
                                    {expandedIndex === index ? (
                                      <ChevronUp className='h-4 w-4 text-muted-foreground' />
                                    ) : (
                                      <ChevronDown className='h-4 w-4 text-muted-foreground' />
                                    )}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                            </div>

                            <CollapsibleContent>
                              <CardContent className='space-y-4 border-t border-border mt-2 pt-4'>
                                <div className='space-y-2'>
                                  <Label>Project Title</Label>
                                  <Input value={project.title} onChange={e => updateProject(index, 'title', e.target.value)} />
                                </div>

                                <div className='space-y-2'>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={project.description}
                                    onChange={e => updateProject(index, 'description', e.target.value)}
                                    placeholder='Describe the project...'
                                    rows={4}
                                  />
                                </div>

                                <ImageUpload currentImage={project.image} onImageChange={url => updateProject(index, 'image', url)} label='Project Image' />

                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <Label className='flex items-center gap-1.5'>
                                      <ExternalLink className='h-3.5 w-3.5' /> Live Link
                                    </Label>
                                    <Input
                                      type='url'
                                      value={project.link || ''}
                                      onChange={e => updateProject(index, 'link', e.target.value)}
                                      placeholder='https://...'
                                    />
                                  </div>
                                  <div className='space-y-2'>
                                    <Label className='flex items-center gap-1.5'>
                                      <Github className='h-3.5 w-3.5' /> GitHub Link
                                    </Label>
                                    <Input
                                      type='url'
                                      value={project.github || ''}
                                      onChange={e => updateProject(index, 'github', e.target.value)}
                                      placeholder='https://github.com/...'
                                    />
                                  </div>
                                </div>

                                {/* Tags */}
                                <div className='space-y-2'>
                                  <Label>Technologies / Tags</Label>
                                  <div className='flex flex-wrap gap-2'>
                                    {project.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant='secondary' className='gap-1 pr-1'>
                                        {tag}
                                        <button
                                          type='button'
                                          onClick={() => removeTag(index, tagIndex)}
                                          className='ml-1 hover:text-destructive transition-colors rounded-full'
                                        >
                                          <X className='h-3 w-3' />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className='flex gap-2'>
                                    <Input
                                      placeholder='Add tag...'
                                      className='flex-1'
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addTag(index, (e.target as HTMLInputElement).value);
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
                                        addTag(index, input.value);
                                        input.value = '';
                                      }}
                                    >
                                      <Plus className='h-4 w-4 mr-1' />
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
