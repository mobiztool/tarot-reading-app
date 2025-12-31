import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarot Reading App',
  description: 'Daily mystical tarot card readings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
