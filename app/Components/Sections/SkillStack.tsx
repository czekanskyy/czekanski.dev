import { Fira_Mono } from 'next/font/google';

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const skillStack = [
  {
    category: 'Project Design',
    skills: ['Figma', 'Photoshop'],
  },
  {
    category: 'Front End Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
  },
  {
    category: 'Wordpress Development',
    skills: ['WordPress', 'PHP', 'WooCommerce', 'Elementor'],
  },
];

export default function SkillStack() {
  return (
    <div id='skills' className={`min-h-screen ${firaMono.className} flex flex-col w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#3</span> Skill Stack
      </h2>

      <div className='grid grid-cols-3 gap-8'>
        {skillStack.map((category, i) => (
          <div key={i} className='border border-white p-6 flex flex-col gap-4 bg-neutral-900/30'>
            <div className='flex items-center gap-4 mb-2'>
              <h3 className='text-2xl text-white font-bold leading-tight w-min'>{category.category}</h3>
            </div>
            <div className='font-mono text-neutral-400 text-sm'>
              <span className='text-blue-400'>&lt;ul&gt;</span>
              <ul className='list-none flex flex-col gap-1 pl-4 my-1 border-l border-neutral-800'>
                {category.skills.map((skill, j) => (
                  <li key={j} className='flex items-center gap-2'>
                    <span className='text-blue-400'>&lt;li&gt;</span>
                    <span className='text-white'>{skill}</span>
                    <span className='text-blue-400'>&lt;/li&gt;</span>
                  </li>
                ))}
              </ul>
              <span className='text-blue-400'>&lt;/ul&gt;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
