'use client';

import { Fira_Mono } from 'next/font/google';
import { useState } from 'react';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const experience = [
  {
    id: 1,
    role: 'Web Admin',
    company: 'Semistocks',
    period: '2023 - present',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dui odio, lobortis at elementum et, cursus et lectus. Responsible for managing the company website, ensuring uptime, and implementing new features using WordPress and Elementor.',
    technologies: ['WordPress', 'WooCommerce', 'Elementor', 'Hosting Management'],
  },
  {
    id: 2,
    role: 'MSc Student',
    company: 'Rzeszów University of Technology',
    period: '2023 - present',
    description: 'Studying Computer Science with a focus on Web Technologies. Working on advanced projects involving modern frameworks and cloud solutions.',
    technologies: [],
  },
  {
    id: 3,
    role: 'IT Specialist',
    company: '"Erblick" Krosno High School',
    period: '2019 - 2023',
    description:
      'Maintained school computer systems and network infrastructure. Provided technical support to staff and students, ensuring smooth operation of educational technology.',
    technologies: [],
  },
];

export default function Experience() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id='experience' className={`min-h-screen ${firaMono.className} flex flex-col w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#4</span> Experience
      </h2>

      <div className='flex flex-col gap-4'>
        {experience.map(exp => (
          <div key={exp.id} className='bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden transition-all duration-300'>
            <button
              onClick={() => toggleAccordion(exp.id)}
              className='w-full flex justify-between items-center p-6 hover:bg-neutral-800/50 transition-colors text-left'
            >
              <div>
                <h3 className={`text-xl font-bold transition-colors ${openId === exp.id ? 'text-blue-400' : 'text-white'}`}>
                  {exp.role} <span className='text-neutral-500 font-normal'>@ {exp.company}</span>
                </h3>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-neutral-500 text-sm'>{exp.period}</span>
                <span className={`text-neutral-400 transform transition-transform duration-300 ${openId === exp.id ? 'rotate-180' : ''}`}>▼</span>
              </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${openId === exp.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className='overflow-hidden'>
                <div className='p-6 pt-0 border-t border-neutral-800/50'>
                  <p className='text-neutral-400 text-sm leading-relaxed mb-4'>{exp.description}</p>
                  {exp.technologies.length > 0 && (
                    <div className='flex gap-2 flex-wrap'>
                      {exp.technologies.map((tech, j) => (
                        <span key={j} className='text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-700'>
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
