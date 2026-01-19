'use client';
import { useEffect, useRef } from 'react';

export default function MouseSpotlight() {
  const blobRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const loop = () => {
      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;

      const ease = 0.1;

      pos.current.x += dx * ease;
      pos.current.y += dy * ease;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className='fixed inset-0 z-30 pointer-events-none overflow-hidden'>
      <div ref={blobRef} className='absolute top-0 left-0 will-change-transform'>
        <div className='relative -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px]'>
          <div className='w-full h-full animate-[spin_5s_linear_infinite]'>
            <div className='absolute top-0 left-0 w-24 h-24 bg-cyan-400/40 rounded-full blur-[30px] mix-blend-screen' />

            <div className='absolute bottom-0 right-0 w-24 h-24 bg-purple-500/40 rounded-full blur-[35px] mix-blend-screen' />

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pink-400/40 rounded-full blur-[20px] mix-blend-screen' />
          </div>
        </div>
      </div>
    </div>
  );
}
