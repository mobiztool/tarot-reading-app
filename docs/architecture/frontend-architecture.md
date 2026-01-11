# Frontend Architecture

This section defines frontend-specific architecture details including component organization, state management, routing patterns, and service layer abstractions.

## Component Architecture

**Organization Strategy:** Feature-based structure with shared UI components

```
apps/web/src/
├── app/                          # Next.js App Router (pages)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page (/)
│   ├── reading/
│   │   ├── page.tsx            # Reading type selection (/reading)
│   │   ├── daily/page.tsx      # Daily reading flow
│   │   └── three-card/page.tsx # 3-Card spread flow
│   ├── cards/
│   │   ├── page.tsx            # Card encyclopedia list
│   │   └── [slug]/page.tsx     # Individual card detail
│   ├── history/page.tsx         # Reading history (auth required)
│   ├── profile/page.tsx         # User profile (auth required)
│   ├── favorites/page.tsx       # Favorite cards (Epic 4)
│   └── auth/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── ui/                      # Base UI components (Button, Input, Card, Modal)
│   ├── cards/                   # Card-specific components
│   │   ├── CardDisplay.tsx     # Single card display
│   │   ├── CardFlip.tsx        # 3D flip animation
│   │   ├── CardFan.tsx         # Fan layout for selection
│   │   └── CardGrid.tsx        # Grid layout for encyclopedia
│   ├── reading/
│   │   ├── ReadingResult.tsx   # Reading result display
│   │   ├── ReadingHistory.tsx  # History list
│   │   └── ReadingCard.tsx     # Card in reading context
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   └── features/
│       ├── ShareButton.tsx
│       ├── FavoriteButton.tsx
│       └── ThemeSelector.tsx
├── lib/
│   ├── api/                     # API client layer
│   │   ├── readings.ts         # Reading API calls
│   │   ├── cards.ts            # Card API calls
│   │   ├── users.ts            # User API calls
│   │   └── favorites.ts        # Favorites API calls
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useReading.ts       # Reading state management
│   │   ├── useCards.ts         # Card data fetching
│   │   └── useAnalytics.ts     # Analytics tracking
│   ├── utils/                   # Utility functions
│   │   ├── shuffle.ts          # Client-side shuffle visualization
│   │   ├── format.ts           # Date/text formatting
│   │   └── validation.ts       # Zod schemas
│   └── stores/                  # Zustand stores
│       ├── authStore.ts        # Auth state
│       ├── readingStore.ts     # Reading flow state
│       └── uiStore.ts          # UI state (modals, toasts)
├── styles/
│   └── globals.css             # Global styles + Tailwind
└── types/
    └── index.ts                # Frontend-specific types
```

**Component Template:**

```typescript
// components/cards/CardDisplay.tsx
'use client';

import { Card } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CardDisplayProps {
  card: Card;
  isReversed?: boolean;
  showInterpretation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CardDisplay({ 
  card, 
  isReversed = false, 
  showInterpretation = false,
  size = 'md' 
}: CardDisplayProps) {
  const interpretation = isReversed ? card.meaning_reversed : card.meaning_upright;
  
  return (
    <motion.div
      className={`card-display card-${size}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`card-image-wrapper ${isReversed ? 'reversed' : ''}`}>
        <Image
          src={card.image_url}
          alt={`${card.name_th} - ${card.name}`}
          width={300}
          height={500}
          className="card-image"
          priority={size === 'lg'}
        />
      </div>
      
      <h3 className="card-name">
        {card.name_th}
        <span className="card-name-en">{card.name}</span>
      </h3>
      
      {showInterpretation && (
        <div className="card-interpretation">
          <p>{interpretation}</p>
        </div>
      )}
    </motion.div>
  );
}
```

## State Management Architecture

**Strategy:** Hybrid approach using React Context + Zustand

**1. Auth State (React Context):**

```typescript
// lib/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**2. Reading State (Zustand):**

```typescript
// lib/stores/readingStore.ts
import { create } from 'zustand';
import { Reading, Card } from '@/types';

interface ReadingState {
  currentReading: Reading | null;
  selectedCards: Card[];
  readingType: 'daily' | 'three_card' | null;
  question: string;
  
  // Actions
  setReadingType: (type: 'daily' | 'three_card') => void;
  setQuestion: (question: string) => void;
  addSelectedCard: (card: Card) => void;
  clearSelection: () => void;
  setCurrentReading: (reading: Reading) => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentReading: null,
  selectedCards: [],
  readingType: null,
  question: '',
  
  setReadingType: (type) => set({ readingType: type }),
  setQuestion: (question) => set({ question }),
  addSelectedCard: (card) => 
    set((state) => ({ selectedCards: [...state.selectedCards, card] })),
  clearSelection: () => 
    set({ selectedCards: [], question: '', readingType: null }),
  setCurrentReading: (reading) => set({ currentReading: reading }),
}));
```

## Routing Architecture

**Next.js App Router Structure:**

```typescript
// app/layout.tsx - Root layout with providers
import { AuthProvider } from '@/lib/context/AuthContext';
import { Analytics } from '@/components/Analytics';
import { Toaster } from '@/components/ui/Toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

// app/reading/layout.tsx - Reading-specific layout
export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reading-layout">
      <main>{children}</main>
    </div>
  );
}
```

**Protected Route Pattern:**

```typescript
// components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=' + window.location.pathname);
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

## Frontend Services Layer

**API Client Setup:**

```typescript
// lib/api/client.ts
import { supabase } from '@/lib/supabase';

interface ApiOptions {
  requireAuth?: boolean;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requireAuth = false, method = 'GET', body } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if required
  if (requireAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}
```

**Service Example:**

```typescript
// lib/api/readings.ts
import { apiCall } from './client';
import { Reading, ReadingWithCards, CreateReadingRequest } from '@/types';

export const readingsApi = {
  create: async (data: CreateReadingRequest): Promise<ReadingWithCards> => {
    return apiCall('/readings', {
      method: 'POST',
      body: data,
      requireAuth: false, // Optional auth
    });
  },

  getHistory: async (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall<{ readings: ReadingWithCards[]; total: number }>(
      `/readings?${query}`,
      { requireAuth: true }
    );
  },

  getById: async (id: string): Promise<ReadingWithCards> => {
    return apiCall(`/readings/${id}`, { requireAuth: false });
  },

  update: async (id: string, data: Partial<Reading>) => {
    return apiCall(`/readings/${id}`, {
      method: 'PATCH',
      body: data,
      requireAuth: true,
    });
  },

  delete: async (id: string) => {
    return apiCall(`/readings/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
```

---
