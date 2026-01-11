/**
 * Premium Gate Page
 * Shown when users try to access a locked spread
 * Story 6.3: Feature Gating by Subscription Tier
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PremiumGate } from '@/components/gates';
import { SPREAD_INFO, getUserTier, SpreadType } from '@/lib/access-control';
import { SubscriptionTier } from '@/types/subscription';

interface PageProps {
  searchParams: Promise<{ spread?: string; tier?: string }>;
}

export default async function PremiumGatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const spreadType = params.spread as SpreadType | undefined;
  const requiredTier = (params.tier as SubscriptionTier) || 'basic';

  // If no spread specified, redirect to reading selection
  if (!spreadType) {
    redirect('/reading');
  }

  // Get spread info
  const spreadInfo = SPREAD_INFO[spreadType];
  if (!spreadInfo) {
    redirect('/reading');
  }

  // Get current user's tier
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentTier: SubscriptionTier = user ? await getUserTier(user.id) : 'free';

  return (
    <PremiumGate
      spreadName={spreadInfo.id}
      spreadNameTh={spreadInfo.nameTh}
      spreadIcon={spreadInfo.icon}
      requiredTier={requiredTier}
      currentTier={currentTier}
    />
  );
}
