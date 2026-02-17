import type { Metadata } from 'next';
import { getContent } from '@/lib/db';

import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const hero = content?.hero;

  return {
    title: hero?.pageTitle || 'Dominik Czekański 👨🏻‍💻',
    description: hero?.pageDescription || "Hi, I'm Dominik and I sincerely welcome you to my website!",
    icons: hero?.favicon ? { icon: hero.favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
