import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Dominik Czekański 👨🏻‍💻',
  description: "Hi, I'm Dominik and I sincerly welcome you to my website!",
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
