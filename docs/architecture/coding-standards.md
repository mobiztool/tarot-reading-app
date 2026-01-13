# Coding Standards

## Critical Fullstack Rules

**Project-Specific Standards (AI agents must follow):**

- **Type Sharing:** Always define types in `packages/shared` and import from there. Never duplicate type definitions.

- **API Calls:** Never make direct HTTP calls with `fetch`. Always use the service layer (`lib/api/*`).

- **Environment Variables:** Access only through config objects. Never use `process.env` directly in components.
  ```typescript
  // Good
  import { config } from '@/lib/config';
  const apiUrl = config.supabaseUrl;
  
  // Bad
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  ```

- **Error Handling:** All API routes must use the standard error handler. Never throw raw errors.
  ```typescript
  // Good
  return handleApiError(error);
  
  // Bad
  throw new Error('Something went wrong');
  ```

- **State Updates:** Never mutate state directly. Use proper state management patterns (Zustand, React setState).

- **Database Queries:** Always use Prisma ORM. Never write raw SQL except for migrations.

- **Authentication:** Always validate auth on protected routes. Check both middleware and RLS.

- **Image Optimization:** Always use Next.js `Image` component. Never use `<img>` tags.

- **Async/Await:** Prefer async/await over promises. Always handle errors with try/catch.

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| **Components** | PascalCase | - | `UserProfile.tsx` |
| **Hooks** | camelCase with 'use' | - | `useAuth.ts` |
| **API Routes** | - | kebab-case | `/api/user-profile` |
| **Database Tables** | - | snake_case | `user_profiles` |
| **Functions** | camelCase | camelCase | `getUserProfile()` |
| **Constants** | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| **Types/Interfaces** | PascalCase | PascalCase | `UserProfile` |
| **Files** | kebab-case or PascalCase | kebab-case | `user-profile.ts` or `UserProfile.tsx` |

## Code Style

**ESLint + Prettier enforced:**
- Indent: 2 spaces
- Quotes: Single quotes
- Semicolons: Yes
- Trailing commas: es5
- Max line length: 100 characters

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for functions
- No unused variables

---
