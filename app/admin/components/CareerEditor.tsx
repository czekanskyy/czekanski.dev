'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Save, X, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

import SectionSettings, { SectionMetadata } from './SectionSettings';

interface CareerItem {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

interface CareerData {
  title: string; // Deprecated: managed by SectionSettings
  subtitle: string; // Deprecated: managed by SectionSettings
  items: CareerItem[];
  _meta?: any;
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
          title: initialData._meta.title || 'Career',
          navTitle: initialData._meta.navTitle || 'Career',
          slug: initialData._meta.slug || 'career',
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

  const addItem = () => {
    const newItem: CareerItem = {
      title: 'New Position',
      company: '',
      period: '',
      description: '',
      technologies: [],
    };
    setFormData({ ...formData, items: [newItem, ...formData.items] });
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newItems = Array.from(formData.items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);

    setFormData({ ...formData, items: newItems });
    if (expandedIndex !== null) {
      if (expandedIndex === sourceIndex) {
        setExpandedIndex(destinationIndex);
      } else if (expandedIndex === destinationIndex) {
        setExpandedIndex(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>Career Section</h2>
        <p className='text-sm text-muted-foreground mt-1'>Manage your work experience and positions.</p>
      </div>

      <SectionSettings metadata={metadata} onChange={setMetadata} />

      {/* Career Items */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Positions ({formData.items.length})</h3>
          <Button type='button' variant='outline' size='sm' onClick={addItem}>
            <Plus className='h-4 w-4 mr-2' />
            Add Position
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='career-list'>
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                {formData.items.map((item, index) => (
                  <Draggable key={index} draggableId={`career-${index}`} index={index}>
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                        <Card className={`${snapshot.isDragging ? 'opacity-50 ring-2 ring-primary z-50' : ''}`}>
                          <Collapsible open={expandedIndex === index} onOpenChange={open => setExpandedIndex(open ? index : null)}>
                            <CollapsibleTrigger asChild>
                              <CardHeader className='cursor-pointer hover:bg-accent/50 transition-colors'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-4'>
                                    <div {...provided.dragHandleProps} className='cursor-grab hover:text-foreground text-muted-foreground'>
                                      <GripVertical className='h-5 w-5' />
                                    </div>
                                    <div>
                                      <CardTitle className='text-base'>{item.title || 'Untitled Position'}</CardTitle>
                                      <p className='text-sm text-muted-foreground mt-0.5'>
                                        {item.company}
                                        {item.company && item.period ? ' · ' : ''}
                                        {item.period}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={e => {
                                        e.stopPropagation();
                                        removeItem(index);
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
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className='space-y-4 pt-0'>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <Label>Job Title</Label>
                                    <Input value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                  </div>
                                  <div className='space-y-2'>
                                    <Label>Company</Label>
                                    <Input value={item.company} onChange={e => updateItem(index, 'company', e.target.value)} />
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <Label>Period</Label>
                                  <Input value={item.period} onChange={e => updateItem(index, 'period', e.target.value)} placeholder='e.g., 2020 - Present' />
                                </div>

                                <div className='space-y-2'>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={item.description}
                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                    placeholder='Describe the role...'
                                    rows={4}
                                  />
                                </div>

                                {/* Technologies */}
                                <div className='space-y-2'>
                                  <Label>Technologies Used</Label>
                                  <div className='flex flex-wrap gap-2'>
                                    {item.technologies.map((tech, techIndex) => (
                                      <Badge key={techIndex} variant='secondary' className='gap-1 pr-1'>
                                        {tech}
                                        <button
                                          type='button'
                                          onClick={() => removeTech(index, techIndex)}
                                          className='ml-1 hover:text-destructive transition-colors rounded-full'
                                        >
                                          <X className='h-3 w-3' />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className='flex gap-2'>
                                    <Input
                                      placeholder='Add technology...'
                                      className='flex-1'
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addTech(index, (e.target as HTMLInputElement).value);
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
                                        addTech(index, input.value);
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
