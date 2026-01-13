'use client';

import { useState, useEffect, useCallback } from 'react';

const CELEBRATION_SHOWN_KEY = 'tarot_celebration_shown';

/**
 * Hook to manage post-signup celebration modal
 * Shows the modal once after a new user signs up
 */
export function usePostSignupCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if we should show celebration (new signup)
  useEffect(() => {
    // Check URL params for new signup indicator
    const params = new URLSearchParams(window.location.search);
    const isNewSignup = params.get('welcome') === 'true';

    if (isNewSignup) {
      // Check if we've already shown this celebration
      const hasShown = localStorage.getItem(CELEBRATION_SHOWN_KEY);
      
      if (!hasShown) {
        setShowCelebration(true);
        localStorage.setItem(CELEBRATION_SHOWN_KEY, 'true');
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  // Function to manually trigger celebration (for testing)
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
  }, []);

  // Function to reset celebration state (for testing)
  const resetCelebration = useCallback(() => {
    localStorage.removeItem(CELEBRATION_SHOWN_KEY);
  }, []);

  return {
    showCelebration,
    closeCelebration,
    triggerCelebration,
    resetCelebration,
  };
}

export default usePostSignupCelebration;


