'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeroEditor from './components/HeroEditor';
import AboutEditor from './components/AboutEditor';
import SkillsEditor from './components/SkillsEditor';
import ContactEditor from './components/ContactEditor';
import ProjectsEditor from './components/ProjectsEditor';
import CareerEditor from './components/CareerEditor';
import SecurityEditor from './components/SecurityEditor';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Home, User, FolderOpen, Code, Briefcase, Mail, LogOut, Terminal, ChevronRight, Lock, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Map icons to section keys
const SECTION_ICONS: Record<string, any> = {
  hero: Home,
  about: User,
  projects: FolderOpen,
  skills: Code,
  career: Briefcase,
  contact: Mail,
  security: Lock,
};

// Static default order for fallback
const STATIC_NAV_ITEMS = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState<any>(null);
  const [navItems, setNavItems] = useState(STATIC_NAV_ITEMS);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchContent = async () => {
    try {
      // 1. Fetch content for all standard sections
      const sections = ['hero', 'about', 'skills', 'contact', 'projects', 'career'];
      const data: any = {};
      const sectionMetas: any[] = [];

      for (const section of sections) {
        const res = await fetch(`/api/content/${section}`);
        if (res.ok) {
          const sectionData = await res.json();
          data[section] = sectionData;

          if (sectionData._meta) {
            sectionMetas.push(sectionData._meta);
          } else {
            // Fallback if no meta
            sectionMetas.push({ key: section, title: section.charAt(0).toUpperCase() + section.slice(1), order: 99 });
          }
        }
      }

      setContent(data);

      // 2. Build Nav Items from fetched data (sorted by order)
      const dynamicNavItems = sectionMetas
        .filter(meta => meta.key !== 'hero') // Exclude Hero from sortable list
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        .map(meta => ({
          id: meta.key || meta.slug || 'unknown',
          label: meta.title || meta.key,
          icon: SECTION_ICONS[meta.key] || FolderOpen,
          dbId: meta.id, // Needed for reordering
        }));

      // Update navItems state (only sortable items)
      setNavItems(dynamicNavItems);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save');

      // Update local content
      setContent({ ...content, [section]: data });

      // Update title in sidebar if changed (only for sortable items)
      if (data._meta && data._meta.title && section !== 'hero') {
        setNavItems(prev => prev.map(item => (item.id === section ? { ...item, label: data._meta.title } : item)));
      }

      alert('Saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Reorder local state
    const newItems = Array.from(navItems);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);

    setNavItems(newItems);

    // Update DB order
    // Hero is skipped, so index + 2 (assuming Hero is #1) or just relative order for non-hero items.
    // However, if page.tsx filters Hero, we can just save these orders starting from 1 or 2.
    // Let's start from 2 to be safe, reserving 1 for Hero.
    const dbItemsToUpdate = newItems
      .filter(item => (item as any).dbId)
      .map((item, index) => ({
        id: (item as any).dbId,
        order: index + 2, // Start from 2, keeping 1 for Hero
      }));

    if (dbItemsToUpdate.length === 0) return;

    try {
      await fetch('/api/content/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: dbItemsToUpdate }),
      });
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to save new order.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='dark min-h-screen bg-background flex items-center justify-center'>
        <div className='flex items-center gap-3 text-muted-foreground'>
          <Loader2 className='h-5 w-5 animate-spin' />
          <span className='text-sm'>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const renderEditor = () => {
    if (!content && activeSection !== 'security') return null;

    switch (activeSection) {
      case 'hero':
        return <HeroEditor initialData={content.hero} onSave={data => handleSave('hero', data)} />;
      case 'about':
        return <AboutEditor initialData={content.about} onSave={data => handleSave('about', data)} />;
      case 'skills':
        return <SkillsEditor initialData={content.skills} onSave={data => handleSave('skills', data)} />;
      case 'projects':
        return <ProjectsEditor initialData={content.projects} onSave={data => handleSave('projects', data)} />;
      case 'career':
        return <CareerEditor initialData={content.career} onSave={data => handleSave('career', data)} />;
      case 'contact':
        return <ContactEditor initialData={content.contact} onSave={data => handleSave('contact', data)} />;
      case 'security':
        return <SecurityEditor />;
      default:
        return <div className='text-muted-foreground'>Select a section to edit</div>;
    }
  };

  // Determine active label (Hero/Security or from navItems)
  const activeItem = navItems.find(item => item.id === activeSection);
  const activeLabel =
    activeItem?.label || (activeSection === 'hero' ? content?.hero?._meta?.title || 'Hero' : activeSection === 'security' ? 'Security' : 'Section');

  return (
    <div className='dark min-h-screen bg-background flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-card border-r border-border flex flex-col shrink-0'>
        {/* Logo */}
        <div className='p-5 border-b border-border'>
          <div className='flex items-center gap-2'>
            <Terminal className='h-5 w-5 text-primary' />
            <span className='font-mono font-bold text-sm text-foreground'>czekanski.dev</span>
          </div>
          <p className='text-xs text-muted-foreground mt-1.5'>Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-3 flex flex-col gap-1'>
          {/* Static Hero Section */}
          <button
            onClick={() => setActiveSection('hero')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer mb-1 ${
              activeSection === 'hero' ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <Home className='h-4 w-4' />
            {content?.hero?._meta?.title || 'Hero'}
          </button>

          <Separator className='my-1 opacity-50' />

          {/* Draggable Sortable Sections */}
          <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setIsDragging(true)}>
            <Droppable droppableId='sidebar-nav'>
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-1'>
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group flex items-center gap-2 rounded-md ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            style={provided.draggableProps.style}
                          >
                            <div {...provided.dragHandleProps} className='p-2 cursor-grab hover:text-foreground text-muted-foreground'>
                              <GripVertical className='h-4 w-4' />
                            </div>
                            <button
                              onClick={() => setActiveSection(item.id)}
                              className={`flex-1 flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors cursor-pointer text-left ${
                                isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                              }`}
                            >
                              <Icon className='h-4 w-4' />
                              {item.label}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Separator className='my-1 opacity-50' />

          {/* Static Security Section */}
          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer mt-1 ${
              activeSection === 'security' ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <Lock className='h-4 w-4' />
            Security
          </button>
        </nav>

        <Separator />

        {/* User + Sign Out */}
        <div className='p-4'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-8 w-8 rounded-full bg-accent flex items-center justify-center'>
              <User className='h-4 w-4 text-accent-foreground' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-foreground truncate'>{session.user?.name}</p>
              <p className='text-xs text-muted-foreground truncate'>{session.user?.email}</p>
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='w-full text-muted-foreground hover:text-destructive hover:border-destructive'
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className='h-4 w-4 mr-2' />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
        {/* Header */}
        <header className='h-14 border-b border-border flex items-center px-6 shrink-0'>
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-muted-foreground'>Dashboard</span>
            <ChevronRight className='h-3.5 w-3.5 text-muted-foreground' />
            <span className='text-foreground font-medium'>{activeLabel} Section</span>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 p-6 overflow-y-auto'>
          <div className='max-w-4xl mx-auto'>{renderEditor()}</div>
        </main>
      </div>
    </div>
  );
}
