'use client';

import { Fira_Mono } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const featuredProject = {
  id: 1,
  title: 'Featured Project',
  description:
    'This is the project I am currently working on. It features a modern tech stack and solves a real-world problem. The description highlights the key challenges and solutions implemented.',
  image: '/placeholder-project.jpg',
  demoUrl: 'https://example.com',
  repoUrl: 'https://github.com',
  tags: ['Next.js', 'TypeScript', 'Tailwind'],
};

const projects = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 2,
  title: `Project ${i + 1}`,
  description: 'Short description of the project. This is a placeholder text to demonstrate the layout.',
  image: '/placeholder-project.jpg',
  demoUrl: 'https://example.com',
  repoUrl: 'https://github.com',
  tags: ['React', 'CSS'],
}));

export default function Projects() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div id='projects' className={`min-h-screen ${firaMono.className} flex flex-col w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#2</span> My Projects
      </h2>

      {/* Featured Project */}
      <div className='mb-24'>
        <h3 className='text-2xl text-white font-bold mb-8'>Currently Working On</h3>
        <div className='grid grid-cols-2 gap-12 items-center bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800'>
          <div className='flex flex-col gap-6'>
            <h4 className='text-4xl text-white font-bold'>{featuredProject.title}</h4>
            <p className='text-neutral-400 text-lg leading-relaxed text-justify'>{featuredProject.description}</p>
            <div className='flex gap-2 flex-wrap'>
              {featuredProject.tags.map((tag, i) => (
                <span key={i} className='text-sm text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full bg-blue-400/10'>
                  {tag}
                </span>
              ))}
            </div>
            <div className='flex gap-6 mt-2'>
              <Link
                href={featuredProject.demoUrl}
                target='_blank'
                className='text-white hover:text-blue-400 transition-colors font-bold border-b-2 border-transparent hover:border-blue-400'
              >
                Live Demo
              </Link>
              <Link
                href={featuredProject.repoUrl}
                target='_blank'
                className='text-white hover:text-blue-400 transition-colors font-bold border-b-2 border-transparent hover:border-blue-400'
              >
                GitHub Repo
              </Link>
            </div>
          </div>
          <div className='relative w-full aspect-video bg-neutral-800 rounded-xl overflow-hidden'>
            {/* Placeholder for featured project image */}
            <div className='absolute inset-0 flex items-center justify-center text-neutral-600'>Featured Project Image</div>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className='relative'>
        <div className={`grid grid-cols-3 gap-6 transition-all duration-500 ${!isExpanded ? 'max-h-[600px] overflow-hidden' : ''}`}>
          {projects.map((project, i) => {
            // Determine column span based on index
            // 0: col-span-2 (Row 1 Left)
            // 1: col-span-1 (Row 1 Right)
            // 2: col-span-1 (Row 2 Left)
            // 3: col-span-2 (Row 2 Right)
            // Pattern repeats every 4 items
            const isLarge = i % 4 === 0 || i % 4 === 3;
            const colSpan = isLarge ? 'col-span-2' : 'col-span-1';

            return (
              <div
                key={project.id}
                className={`group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 transition-colors ${colSpan}`}
              >
                <div className='aspect-video bg-neutral-800 relative w-full'>
                  {/* Placeholder image */}
                  <div className='absolute inset-0 flex items-center justify-center text-neutral-700 text-xs'>IMAGE</div>
                </div>
                <div className='p-6 flex flex-col gap-4'>
                  <div className='flex justify-between items-start'>
                    <h4 className='text-xl text-white font-bold group-hover:text-blue-400 transition-colors'>{project.title}</h4>
                    <div className='flex gap-2'>
                      <span className='text-xs text-neutral-500'>View:</span>
                      <span className='text-xs text-white font-bold'>ICONS</span>
                    </div>
                  </div>

                  <div className='flex justify-between items-end mt-auto'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs text-neutral-500'>Stack:</span>
                      <div className='flex gap-2 flex-wrap'>
                        {project.tags.slice(0, 2).map((tag, j) => (
                          <span key={j} className='text-sm text-white font-bold'>
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fade Out Overlay & Load More Button */}
        {!isExpanded && (
          <div className='absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent flex items-end justify-center pb-8 z-10'>
            <button
              onClick={() => setIsExpanded(true)}
              className='text-white font-mono text-lg hover:text-blue-400 transition-colors flex items-center gap-2 group'
            >
              Load More <span className='group-hover:translate-x-1 transition-transform'>&gt;_</span>
            </button>
          </div>
        )}

        {isExpanded && (
          <div className='flex justify-center mt-8'>
            <button onClick={() => setIsExpanded(false)} className='text-neutral-500 font-mono text-sm hover:text-white transition-colors'>
              Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
