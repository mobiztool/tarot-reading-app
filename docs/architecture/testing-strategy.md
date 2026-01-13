# Testing Strategy

Comprehensive testing approach following the testing pyramid (70% unit, 20% integration, 10% E2E).

## Testing Pyramid

```
        E2E Tests (10%)
       /              \
    Integration Tests (20%)
   /                      \
Frontend Unit (35%)  Backend Unit (35%)
```

## Test Organization

**Frontend Tests:**

```
apps/web/tests/
├── unit/
│   ├── components/
│   │   ├── CardDisplay.test.tsx
│   │   ├── ReadingResult.test.tsx
│   │   └── Navigation.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useReading.test.ts
│   └── utils/
│       ├── shuffle.test.ts
│       └── format.test.ts
├── integration/
│   ├── api/
│   │   ├── readings.test.ts
│   │   └── users.test.ts
│   └── flows/
│       ├── reading-flow.test.tsx
│       └── auth-flow.test.tsx
└── e2e/
    ├── daily-reading.spec.ts
    ├── three-card-spread.spec.ts
    ├── user-signup.spec.ts
    └── reading-history.spec.ts
```

## Test Examples

**Frontend Component Test:**

```typescript
// tests/unit/components/CardDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { CardDisplay } from '@/components/cards/CardDisplay';

describe('CardDisplay', () => {
  const mockCard = {
    id: '1',
    name: 'The Fool',
    name_th: 'คนบ้า',
    image_url: '/cards/fool.webp',
    meaning_upright: 'New beginnings...',
    meaning_reversed: 'Recklessness...',
    // ... other fields
  };

  it('renders card image and name', () => {
    render(<CardDisplay card={mockCard} />);
    
    expect(screen.getByAltText(/คนบ้า/)).toBeInTheDocument();
    expect(screen.getByText('คนบ้า')).toBeInTheDocument();
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });

  it('shows upright interpretation when not reversed', () => {
    render(<CardDisplay card={mockCard} isReversed={false} showInterpretation />);
    
    expect(screen.getByText(/New beginnings/)).toBeInTheDocument();
  });

  it('shows reversed interpretation when reversed', () => {
    render(<CardDisplay card={mockCard} isReversed={true} showInterpretation />);
    
    expect(screen.getByText(/Recklessness/)).toBeInTheDocument();
  });
});
```

**Backend API Test:**

```typescript
// tests/integration/api/readings.test.ts
import { POST, GET } from '@/app/api/readings/route';
import { createMockRequest } from '@/tests/helpers';
import { prisma } from '@/lib/prisma';

describe('POST /api/readings', () => {
  afterEach(async () => {
    await prisma.reading.deleteMany();
  });

  it('creates daily reading for anonymous user', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {
        reading_type: 'daily',
        question: 'Test question',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.reading).toBeDefined();
    expect(data.reading.reading_type).toBe('daily');
    expect(data.reading.user_id).toBeNull();
  });

  it('requires authentication for reading history', async () => {
    const request = createMockRequest({ method: 'GET' });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

**E2E Test:**

```typescript
// tests/e2e/daily-reading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Daily Reading Flow', () => {
  test('complete daily reading as anonymous user', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/ดูดวงไพ่ยิปซี/);

    // Click "เริ่มดูดวง" button
    await page.click('text=เริ่มดูดวง');
    await expect(page).toHaveURL('/reading');

    // Select Daily Reading
    await page.click('text=ดูดวงประจำวัน');
    await expect(page).toHaveURL('/reading/daily');

    // Enter question (optional)
    await page.fill('input[name="question"]', 'วันนี้จะเป็นอย่างไร?');

    // Click to draw card
    await page.click('text=เลือกไพ่');

    // Wait for card flip animation
    await page.waitForSelector('.card-result', { timeout: 5000 });

    // Verify result displayed
    await expect(page.locator('.card-image')).toBeVisible();
    await expect(page.locator('.card-interpretation')).toBeVisible();

    // Verify signup prompt shown
    await expect(page.locator('text=Sign up to save')).toBeVisible();
  });
});
```

## Testing Tools & Configuration

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Coverage Targets:**
- **Overall:** >70%
- **Critical paths:** >90% (auth, reading creation, data access)
- **UI components:** >60% (focus on logic, not styling)

---
