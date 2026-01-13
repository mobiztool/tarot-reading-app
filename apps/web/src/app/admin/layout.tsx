import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tarot App',
  description: 'Admin dashboard for managing the Tarot app',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

