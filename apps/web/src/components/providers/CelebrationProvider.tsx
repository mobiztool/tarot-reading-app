'use client';

import { createContext, useContext, ReactNode } from 'react';
import { UnlockedSpreadsModal } from '@/components/modals/UnlockedSpreadsModal';
import { usePostSignupCelebration } from '@/lib/hooks/usePostSignupCelebration';

interface CelebrationContextType {
  triggerCelebration: () => void;
  resetCelebration: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within CelebrationProvider');
  }
  return context;
}

interface CelebrationProviderProps {
  children: ReactNode;
}

export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const {
    showCelebration,
    closeCelebration,
    triggerCelebration,
    resetCelebration,
  } = usePostSignupCelebration();

  return (
    <CelebrationContext.Provider value={{ triggerCelebration, resetCelebration }}>
      {children}
      <UnlockedSpreadsModal isOpen={showCelebration} onClose={closeCelebration} />
    </CelebrationContext.Provider>
  );
}

export default CelebrationProvider;


