import type { Metadata } from 'next';

import './globals.css';

export const revalidate = 60; // ISR: regenerate layout every 60 seconds

export const metadata: Metadata = {
  metadataBase: new URL('https://czekanski.dev'),
  title: 'Dominik Czekański 👨🏻‍💻',
  description:
    "Welcome to my portfolio. I'm Dominik and I create performant, responsive websites with Next.js and WordPress. View my projects and get in touch today!",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dominik Czekański 👨🏻‍💻',
    description:
      "Welcome to my portfolio. I'm Dominik and I create performant, responsive websites with Next.js and WordPress. View my projects and get in touch today!",
    url: 'https://czekanski.dev',
    siteName: 'Dominik Czekański - Web Developer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Dominik Czekański - Portfolio',
      },
    ],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

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
