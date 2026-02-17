'use client';

import { Fira_Code } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const FEATURED_WORD_LIMIT = 50;
const GRID_WORD_LIMIT = 25;

function truncateWords(text: string, limit: number): { truncated: string; isTruncated: boolean } {
  // Strip HTML tags for plain text display
  const plain = text.replace(/<[^>]*>/g, '');
  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return { truncated: plain, isTruncated: false };
  return { truncated: words.slice(0, limit).join(' ') + '...', isTruncated: true };
}

function ExpandableDescription({ text, wordLimit, className }: { text: string; wordLimit: number; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const plain = text.replace(/<[^>]*>/g, '');
  const { truncated, isTruncated } = truncateWords(text, wordLimit);

  return (
    <div className={className}>
      <p>{expanded ? plain : truncated}</p>
      {isTruncated && (
        <button onClick={() => setExpanded(!expanded)} className='text-blue-400 hover:text-blue-300 transition-colors text-sm mt-1 font-medium'>
          {expanded ? '← Show less' : 'Read more →'}
        </button>
      )}
    </div>
  );
}

interface Project {
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
}

interface ProjectsProps {
  data: {
    items: Project[];
    _meta?: any;
  } | null;
  id?: string;
  index?: number;
}

export default function Projects({ data, id, index }: ProjectsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allProjects = data?.items || [];
  const featuredProject = allProjects.length > 0 ? allProjects[0] : null;
  const gridProjects = allProjects.length > 1 ? allProjects.slice(1) : [];
  const sectionTitle = data?._meta?.title || 'My Projects';

  if (!featuredProject && gridProjects.length === 0) {
    return (
      <div
        id={id || 'projects'}
        className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-64 justify-center snap-start`}
      >
        <h2 className='text-3xl md:text-5xl text-white font-bold mb-12'>
          {index && <span className='text-2xl text-blue-400'>#{index}</span>} {sectionTitle}
        </h2>
        <div className='text-neutral-500'>No projects added yet.</div>
      </div>
    );
  }

  return (
    <div id={id || 'projects'} className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-64 justify-center snap-start`}>
      <h2 className='text-3xl md:text-5xl text-white font-bold mb-12'>
        {index && <span className='text-2xl text-blue-400'>#{index}</span>} {sectionTitle}
      </h2>

      {/* Featured Project */}
      {featuredProject && (
        <div className='mb-24'>
          <h3 className='text-2xl text-white font-bold mb-8'>Currently Working On</h3>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-neutral-900/50 p-6 lg:p-8 rounded-lg border border-neutral-800 transition-all hover:border-neutral-700'>
            <div className='flex flex-col gap-6 overflow-hidden'>
              <h4 className='text-2xl lg:text-4xl text-white font-bold break-words'>{featuredProject.title}</h4>
              <ExpandableDescription
                text={featuredProject.description}
                wordLimit={FEATURED_WORD_LIMIT}
                className='text-neutral-400 text-lg leading-relaxed text-justify break-words'
              />
              <div className='flex gap-2 flex-wrap'>
                {featuredProject.tags.map((tag, i) => (
                  <span key={i} className='text-sm text-blue-400 border border-blue-400/30 px-3 py-1 rounded-sm bg-blue-400/10'>
                    {tag}
                  </span>
                ))}
              </div>
              <div className='flex gap-6 mt-2'>
                {featuredProject.link && (
                  <Link
                    href={featuredProject.link}
                    target='_blank'
                    className='text-white hover:text-blue-400 transition-colors font-bold border-b-2 border-transparent hover:border-blue-400'
                  >
                    Live Demo
                  </Link>
                )}
                {featuredProject.github && (
                  <Link
                    href={featuredProject.github}
                    target='_blank'
                    className='text-white hover:text-blue-400 transition-colors font-bold border-b-2 border-transparent hover:border-blue-400'
                  >
                    GitHub Repo
                  </Link>
                )}
              </div>
            </div>
            <div className='relative w-full aspect-video bg-neutral-800 rounded-md overflow-hidden shadow-2xl shadow-black'>
              {featuredProject.image ? (
                <img src={featuredProject.image} alt={featuredProject.title} className='object-cover w-full h-full' />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center text-neutral-600'>Featured Project Image</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project Grid */}
      {gridProjects.length > 0 && (
        <div className='relative'>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${!isExpanded ? 'max-h-[600px] overflow-hidden' : ''}`}
          >
            {gridProjects.map((project, i) => {
              const isLarge = i % 4 === 0 || i % 4 === 3;
              const colSpan = isLarge ? 'lg:col-span-2' : 'lg:col-span-1';

              return (
                <div
                  key={i}
                  className={`group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors flex flex-col ${colSpan}`}
                >
                  <div className='aspect-video bg-neutral-800 relative w-full'>
                    {project.image ? (
                      <img src={project.image} alt={project.title} className='object-cover w-full h-full' />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center text-neutral-700 text-xs'>IMAGE</div>
                    )}
                  </div>
                  <div className='p-6 flex flex-col flex-1 gap-4 overflow-hidden'>
                    <div className='flex justify-between items-start gap-4'>
                      <h4 className='text-xl text-white font-bold transition-colors break-words'>{project.title}</h4>
                    </div>

                    <ExpandableDescription text={project.description} wordLimit={GRID_WORD_LIMIT} className='text-neutral-400 text-sm break-words' />

                    <div className='flex flex-wrap justify-between items-end mt-auto gap-4'>
                      <div className='flex flex-col gap-2'>
                        <span className='text-[10px] text-neutral-500 uppercase tracking-widest'>Stack</span>
                        <div className='flex gap-2 flex-wrap'>
                          {project.tags.slice(0, 3).map((tag, j) => (
                            <span key={j} className='text-[10px] text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-sm bg-blue-400/10 font-medium'>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className='flex gap-3'>
                        {project.link && (
                          <Link href={project.link} target='_blank' className='text-xs text-white hover:text-blue-300 transition-colors py-1'>
                            Live Demo
                          </Link>
                        )}
                        {project.github && (
                          <Link href={project.github} target='_blank' className='text-xs text-white hover:text-blue-300 transition-colors py-1'>
                            GitHub Repo
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fade Out Overlay & Load More Button */}
          {!isExpanded && gridProjects.length > 4 && (
            <div className='absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-[#09090B] via-[#09090B]/80 to-transparent flex items-end justify-center pb-8 z-10'>
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
      )}
    </div>
  );
}
