'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * AutoSync component
 * Automatically syncs subscriptions from Stripe
 * - Always syncs on first load
 * - Shows sync button for manual sync
 */
export function AutoSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  const syncSubscriptions = useCallback(async (showSuccessMessage = false) => {
    if (syncing) return;
    setSyncing(true);
    setMessage(null);

    try {
      const res = await fetch('/api/subscriptions/sync', {
        method: 'POST',
      });

      const data = await res.json();
      
      if (res.ok) {
        if (showSuccessMessage || data.subscriptions?.length > 0) {
          setMessage('✅ อัพเดทสำเร็จ!');
          // Refresh page to show updated subscription
          setTimeout(() => {
            router.refresh();
            setMessage(null);
          }, 1500);
        }
      } else {
        // Show error for manual syncs
        if (showSuccessMessage) {
          setMessage('❌ ' + (data.error || 'Sync failed'));
          setTimeout(() => setMessage(null), 3000);
        }
        console.log('Sync response:', data);
      }
    } catch (err) {
      console.error('Auto-sync error:', err);
      if (showSuccessMessage) {
        setMessage('❌ เกิดข้อผิดพลาด');
        setTimeout(() => setMessage(null), 3000);
      }
    } finally {
      setSyncing(false);
    }
  }, [syncing, router]);

  useEffect(() => {
    // Sync on every page load, but only once
    if (!hasSynced) {
      setHasSynced(true);
      const success = searchParams.get('success');
      const sessionId = searchParams.get('session_id');
      // Show success message only if coming from checkout
      syncSubscriptions(success === 'true' || !!sessionId);
    }
  }, [searchParams, hasSynced, syncSubscriptions]);

  const handleManualSync = () => {
    syncSubscriptions(true);
  };

  return (
    <>
      {/* Sync status indicator */}
      {(syncing || message) && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
          message?.startsWith('❌') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {syncing ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>กำลังซิงค์จาก Stripe...</span>
            </>
          ) : (
            <span>{message}</span>
          )}
        </div>
      )}
      
      {/* Manual sync button - hidden (AutoSync handles it automatically) */}
      {/* To re-enable, uncomment the button below */}
      {/*
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {syncing ? 'กำลังซิงค์...' : 'ซิงค์จาก Stripe'}
        </button>
      </div>
      */}
    </>
  );
}
