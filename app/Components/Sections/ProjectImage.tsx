'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
// import { Media } from '@/payload-types'; 

export default function ProjectImage({ image, alt }: { image: any, alt: string }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const img = imageRef.current;
      if (img) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPos = (clientX / innerWidth) * 20 - 10;
        const yPos = (clientY / innerHeight) * 20 - 10;
        img.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle Payload Media object or URL string
  const imageUrl = typeof image === 'string' ? image : image?.url;

  if (!imageUrl) return null;

  return (
    <div ref={imageRef} className="transition-transform duration-100 ease-out">
       <Image 
        src={imageUrl} 
        alt={alt} 
        width={600} 
        height={400} 
        className='rounded-lg shadow-lg' 
        unoptimized // Payload images might be external or local without next/image optimization setup
       />
    </div>
  );
}
