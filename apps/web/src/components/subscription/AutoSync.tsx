'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * AutoSync component
 * Automatically syncs subscriptions from Stripe when redirected back from checkout
 * This runs silently in the background when ?success=true is in the URL
 */
export function AutoSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    // Only sync if coming back from successful Stripe checkout
    if (success === 'true' || sessionId) {
      syncSubscriptions();
    }
  }, [searchParams]);

  const syncSubscriptions = async () => {
    if (syncing) return;
    setSyncing(true);

    try {
      const res = await fetch('/api/subscriptions/sync', {
        method: 'POST',
      });

      if (res.ok) {
        setMessage('✅ การชำระเงินสำเร็จ!');
        // Refresh page to show updated subscription
        setTimeout(() => {
          router.replace('/profile/billing');
          router.refresh();
        }, 1500);
      } else {
        // Silently fail - webhook will handle it eventually
        console.log('Sync failed, webhook will handle');
      }
    } catch (err) {
      console.error('Auto-sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Show syncing indicator only when actively syncing
  if (syncing || message) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        {syncing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>กำลังอัพเดท...</span>
          </>
        ) : (
          <span>{message}</span>
        )}
      </div>
    );
  }

  return null;
}
