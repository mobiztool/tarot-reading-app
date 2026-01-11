'use client';

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react';

interface AnnouncerContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(undefined);

/**
 * Hook to announce messages to screen readers
 * Uses ARIA live regions to notify users of dynamic content changes
 */
export function useAnnounce() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Return no-op if not wrapped in provider (for SSR)
    return { announce: () => {} };
  }
  return context;
}

interface LiveAnnouncerProviderProps {
  children: ReactNode;
}

/**
 * Provider component for screen reader announcements
 * Wrap your app with this to enable live announcements
 */
export function LiveAnnouncerProvider({ children }: LiveAnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      // Small delay to ensure the region is cleared and re-announced
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  // Clear messages after they've been announced
  useEffect(() => {
    if (politeMessage) {
      const timer = setTimeout(() => setPoliteMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [politeMessage]);

  useEffect(() => {
    if (assertiveMessage) {
      const timer = setTimeout(() => setAssertiveMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [assertiveMessage]);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      
      {/* Polite live region - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      
      {/* Assertive live region - for urgent updates */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}


