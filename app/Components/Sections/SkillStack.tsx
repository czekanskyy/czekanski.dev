import { Fira_Code } from 'next/font/google';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

async function getSkillsContent() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/content/skills`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    return [
      { category: 'Frontend Development', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
      { category: 'Backend Development', skills: ['Node.js', 'SQL', 'Docker', 'REST APIs'] },
      { category: 'Wordpress Development', skills: ['WordPress', 'WooCommerce', 'Elementor', 'PHP'] },
    ];
  }
}

export default async function SkillStack() {
  const skillStack = await getSkillsContent();

  return (
    <div id='skills' className={`min-h-screen ${firaCode.className} flex flex-col max-w-[1200px] mx-auto p-8 pt-28 pb-28 justify-center snap-start`}>
      <h2 className='text-5xl text-white font-bold mb-12'>
        <span className='text-2xl text-blue-400'>#3</span> Skill Stack
      </h2>

      <div className='grid md:grid-cols-3 gap-8'>
        {skillStack.map((category: any, i: number) => (
          <div key={i} className='border border-white p-6 flex flex-col gap-4 bg-slate-800/50 relative'>
            <div className='flex items-center gap-4 mb-2'>
              <h3 className='text-2xl text-white font-bold leading-tight w-min'>{category.category}</h3>
            </div>
            <div className='flex md:hidden absolute right-4 top-4 gap-2'>
              <div className='bg-green-400 hover:bg-green-600 w-4 h-4 rounded-full' />
              <div className='bg-yellow-400 hover:bg-yellow-600 w-4 h-4 rounded-full' />
              <div className='bg-red-400 hover:bg-red-600 w-4 h-4 rounded-full' />
            </div>
            <div className='font-mono text-neutral-400 md:text-xs lg:text-sm'>
              <span className='text-neutral-400'>
                &lt;<span className='text-blue-400'>ul</span>&gt;
              </span>
              <ul className='list-none flex flex-col gap-1 pl-4 my-1 border-l border-neutral-800'>
                {category.skills.map((skill: string, j: number) => (
                  <li key={j} className='flex items-center gap-2'>
                    <span className='text-neutral-400'>
                      &lt;<span className='text-blue-400'>li</span>&gt;
                    </span>
                    <span className='text-white'>{skill}</span>
                    <span className='text-neutral-400'>
                      &lt;/<span className='text-blue-400'>li</span>&gt;
                    </span>
                  </li>
                ))}
              </ul>
              <span className='text-neutral-400'>
                &lt;/<span className='text-blue-400'>ul</span>&gt;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
