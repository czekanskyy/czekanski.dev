'use client';
import { useEffect, useRef } from 'react';

// Prosta ikonka samolotu (skierowana w prawo ->)
const PlaneIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    // Obracamy o 90deg, bo ta konkretna ikonka jest skierowana w górę,
    // a w matematyce kąt 0 to kierunek w prawo.
    className='w-full h-full text-white rotate-90'
  >
    <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H1.375a.75.75 0 000 1.5h3.609l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
  </svg>
);

export default function PlaneCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Przechowujemy pozycje (obecną i cel)
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  // Przechowujemy ostatni kąt, żeby samolot nie resetował się przy zatrzymaniu
  const lastAngle = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const loop = () => {
      // Obliczamy wektor (różnicę) między celem a obecną pozycją
      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;

      // Fizyka "gonienia" kursora (LERP)
      // ease = 1.0 oznacza brak opóźnienia (samolot jest przyklejony do myszki)
      // Zmniejsz (np. 0.15), jeśli chcesz, żeby samolot "gonił" kursor z opóźnieniem.
      const ease = 1.0;

      pos.current.x += dx * ease;
      pos.current.y += dy * ease;

      // --- Obliczanie kąta obrotu ---

      // Obliczamy dystans, jaki pokonał kursor w tej klatce
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Aktualizujemy kąt TYLKO wtedy, gdy nastąpił znaczący ruch.
      // Zapobiega to "migotaniu" samolotu, gdy myszka stoi w miejscu (dx, dy są bliskie 0).
      if (distance > 1) {
        // Math.atan2(y, x) zwraca kąt w radianach
        const angleRad = Math.atan2(dy, dx);
        // Konwertujemy na stopnie
        lastAngle.current = angleRad * (180 / Math.PI);
      }

      // Aplikujemy transformacje
      if (cursorRef.current) {
        // Ważna kolejność: najpierw przesuń, potem obróć
        cursorRef.current.style.transform = `
          translate3d(${pos.current.x}px, ${pos.current.y}px, 0) 
          rotate(${lastAngle.current}deg)
        `;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Ustawiamy pozycję początkową poza ekranem, żeby nie mignął na starcie
    pos.current = { x: -100, y: -100 };
    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      // WAŻNE: Przy odmontowaniu komponentu przywróć kursor systemowy!
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    // Kontener musi mieć pointer-events-none, żeby nie blokował kliknięć!
    // Z-index musi być bardzo wysoki (np. z-[9999]), żeby być nad wszystkim.
    <div
      ref={cursorRef}
      className='fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform'
      // Centrujemy samolot idealnie na czubku kursora
      style={{ marginLeft: '-12px', marginTop: '-12px' }}
    >
      {/* Rozmiar samolotu (np. w-6 h-6 = 24px) */}
      <div className='w-6 h-6'>
        <PlaneIcon />
      </div>

      {/* Opcjonalnie: Dodaj ten blob z poprzedniego przykładu POD samolotem */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] -z-10' />
    </div>
  );
}
