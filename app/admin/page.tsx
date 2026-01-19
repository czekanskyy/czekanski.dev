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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch content on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchContent = async () => {
    try {
      const sections = ['hero', 'about', 'skills', 'contact', 'projects', 'career'];
      const data: any = {};
      
      for (const section of sections) {
        const res = await fetch(`/api/content/${section}`);
        if (res.ok) {
          data[section] = await res.json();
        }
      }
      
      setContent(data);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      // Update local state
      setContent({ ...content, [section]: data });
      alert('Saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-neutral-950 flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderEditor = () => {
    if (!content) return null;

    switch (activeSection) {
      case 'hero':
        return <HeroEditor initialData={content.hero} onSave={(data) => handleSave('hero', data)} />;
      case 'about':
        return <AboutEditor initialData={content.about} onSave={(data) => handleSave('about', data)} />;
      case 'skills':
        return <SkillsEditor initialData={content.skills} onSave={(data) => handleSave('skills', data)} />;
      case 'projects':
        return <ProjectsEditor initialData={content.projects} onSave={(data) => handleSave('projects', data)} />;
      case 'career':
        return <CareerEditor initialData={content.career} onSave={(data) => handleSave('career', data)} />;
      case 'contact':
        return <ContactEditor initialData={content.contact} onSave={(data) => handleSave('contact', data)} />;
      default:
        return <div className='text-white'>Select a section to edit</div>;
    }
  };

  return (
    <div className='min-h-screen bg-neutral-950 flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col'>
        <div className='p-6 border-b border-neutral-800'>
          <h1 className='text-xl font-bold text-white'>Admin Panel</h1>
          <p className='text-sm text-neutral-400 mt-1'>Welcome, {session.user?.name}</p>
        </div>

        <nav className='flex-1 p-4'>
          <ul className='space-y-2'>
            {[
              { id: 'hero', label: 'Hero Section' },
              { id: 'about', label: 'About Section' },
              { id: 'skills', label: 'Skills Section' },
              { id: 'projects', label: 'Projects Section' },
              { id: 'career', label: 'Career Section' },
              { id: 'contact', label: 'Contact Section' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className='p-4 border-t border-neutral-800'>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className='w-full px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors'
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-4xl mx-auto'>
          {renderEditor()}
        </div>
      </main>
    </div>
  );
}
