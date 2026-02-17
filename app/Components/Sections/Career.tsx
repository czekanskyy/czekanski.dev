'use client';

import { Fira_Code } from 'next/font/google';
import { useState } from 'react';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

interface Experience {
  id?: number | string; // Allow string IDs if generated
  role?: string; // Map to title from editor if needed, or stick to title
  title?: string; // Editor uses title
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

interface CareerData {
  title?: string;
  subtitle?: string;
  items: Experience[];
  _meta?: {
    title?: string;
    navTitle?: string;
    slug?: string;
  };
}

interface CareerProps {
  data: CareerData | null;
  id?: string;
  index?: number;
}

export default function Career({ data, id, index }: CareerProps) {
  const [openId, setOpenId] = useState<number | string | null>(0);

  const toggleAccordion = (id: number | string) => {
    setOpenId(openId === id ? null : id);
  };

  const experience = data?.items?.length
    ? data.items.map((item, i) => ({
        ...item,
        id: i, // Ensure ID exists for accordion
        role: item.title || item.role || 'Position', // Handle title/role mismatch
      }))
    : [
        {
          id: 1,
          role: 'Web Admin',
          company: 'Sentistocks | Sentimenti',
          period: '2023 - present',
          description:
            'Since 2023, I have been responsible for managing and maintaining the company website built on WordPress. My duties include updating content, optimizing performance, ensuring security, and implementing new features using Elementor and WooCommerce to enhance user experience and support business growth.',
          technologies: ['WordPress', 'WooCommerce', 'Elementor', 'Hosting Management', 'Stripe Payment Gateway'],
        },
        // ... (rest of default data)
      ];

  const sectionTitle = data?._meta?.title || 'Career';

  return (
    <div id={id || 'career'} className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-3xl md:text-5xl text-white font-bold mb-12'>
        {index && <span className='text-2xl text-blue-400'>#{index}</span>} {sectionTitle}
      </h2>

      <div className='flex flex-col gap-4'>
        {experience.map(exp => (
          <div key={exp.id} className='bg-neutral-900/50 border border-neutral-800 overflow-hidden transition-all duration-300 rounded-lg'>
            <button
              onClick={() => toggleAccordion(exp.id)}
              className='w-full flex justify-between items-center p-6 hover:bg-neutral-800/50 transition-colors text-left gap-x-4'
            >
              <div className='flex flex-col lg:flex-row lg:items-center gap-2 w-full'>
                <h3 className='text-lg font-bold transition-colors text-white flex flex-wrap gap-x-2'>{exp.role}</h3>
                <p className='text-neutral-500 font-normal text-sm sm:text-base'>@ {exp.company}</p>
                <p className='text-neutral-500 text-sm lg:ml-auto'>{exp.period}</p>
              </div>
              <div className='flex items-center gap-4'>
                <span className={`text-white transform transition-transform duration-300 text-2xl lg:text-lg ${openId === exp.id ? 'rotate-180' : ''}`}>↓</span>
              </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${openId === exp.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className='overflow-hidden'>
                <div className='p-6 pt-4 border-t border-neutral-800/50'>
                  <p className='text-neutral-300 text-sm leading-relaxed mb-4 text-justify'>{exp.description}</p>
                  {exp.technologies.length > 0 && (
                    <div className='flex gap-2 flex-wrap'>
                      {exp.technologies.map((tech, j) => (
                        <span key={j} className='text-xs bg-neutral-800 text-neutral-300 px-2 py-1 border border-neutral-700 rounded-sm'>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
