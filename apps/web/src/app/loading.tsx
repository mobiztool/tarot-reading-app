import { PageLoader } from '@/components/ui';

/**
 * Global loading UI during route transitions
 * Provides consistent loading experience across all pages
 */
export default function Loading() {
  return <PageLoader message="กำลังโหลด..." />;
}


