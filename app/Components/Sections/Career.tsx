'use client';

import { Fira_Code } from 'next/font/google';
import { useState } from 'react';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const experience = [
  {
    id: 1,
    role: 'Web Admin',
    company: 'Sentistocks | Sentimenti',
    period: '2023 - present',
    description:
      'Since 2023, I have been responsible for managing and maintaining the company website built on WordPress. My duties include updating content, optimizing performance, ensuring security, and implementing new features using Elementor and WooCommerce to enhance user experience and support business growth.',
    technologies: ['WordPress', 'WooCommerce', 'Elementor', 'Hosting Management', 'Stripe Payment Gateway'],
  },
  {
    id: 2,
    role: 'B.Eng. Student',
    company: 'Rzeszów University of Technology',
    period: '2023 - present',
    description:
      "Currently pursuing a Bachelor of Engineering degree in Aviation Engineering in the heart of Poland's 'Aviation Valley'. Alongside academic research, I am actively training for the Air Transport Pilot License (ATPL). This rigorous background in aerodynamics and complex aircraft systems sharpens my analytical skills and attention to detail—traits I directly translate into building stable, high-performance web applications.",
    technologies: ['MATLAB', 'Simulink', 'AutoCAD', 'Ansys'],
  },
  {
    id: 3,
    role: 'IT Technician',
    company: '"Elektryk" Krosno High School',
    period: '2019 - 2023',
    description:
      'Graduated with the IT Technician title, establishing a strong foundation in computer science. The curriculum covered hardware architecture, network administration, and database management. This period transformed my early passion for technology into a professional skill set, serving as the technical launchpad for my current career in modern web development.',
    technologies: ['Network Configuration', 'Database Management', 'Hardware Troubleshooting'],
  },
];

export default function Career() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id='career' className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#4</span> Career
      </h2>

      <div className='flex flex-col gap-4'>
        {experience.map(exp => (
          <div key={exp.id} className='bg-neutral-900/50 border border-neutral-800 overflow-hidden transition-all duration-300'>
            <button
              onClick={() => toggleAccordion(exp.id)}
              className='w-full flex justify-between items-center p-6 hover:bg-neutral-800/50 transition-colors text-left gap-x-4'
            >
              <div>
                <h3 className={`text-lg font-bold transition-colors text-white flex flex-wrap gap-x-2`}>
                  {exp.role} <span className='text-neutral-500 font-normal'>@ {exp.company}</span>
                </h3>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-neutral-500 text-sm'>{exp.period}</span>
                <span className={`text-white transform transition-transform duration-300 ${openId === exp.id ? 'rotate-180' : ''}`}>↓</span>
              </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${openId === exp.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className='overflow-hidden'>
                <div className='p-6 pt-4 border-t border-neutral-800/50'>
                  <p className='text-neutral-300 text-sm leading-relaxed mb-4 text-justify'>{exp.description}</p>
                  {exp.technologies.length > 0 && (
                    <div className='flex gap-2 flex-wrap'>
                      {exp.technologies.map((tech, j) => (
                        <span key={j} className='text-xs bg-neutral-800 text-neutral-300 px-2 py-1 border border-neutral-700'>
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
