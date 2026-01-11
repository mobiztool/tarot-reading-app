# Next Steps

## UX Expert Prompt

You are the UX Expert. Please review the PRD document (`docs/prd.md`) focusing on the "User Interface Design Goals" section and all user stories across the 4 epics.

Your task is to create a comprehensive UX/UI Architecture document that includes:

1. **Design System Specification** - Define the complete visual design system (colors, typography, spacing, components) based on the Mystical/Spiritual aesthetic and Dark Mode requirements specified in the PRD

2. **Detailed User Flows** - Map out all critical user journeys from landing page through reading completion, including edge cases and error states

3. **Wireframes & Mockups** - Create wireframes for all 7 core screens identified in the PRD, ensuring mobile-first responsive design

4. **Component Library Specification** - Define all reusable UI components needed across the application with their states and variants

5. **Interaction Patterns** - Detail all animations, transitions, and micro-interactions specified in the PRD (card flip, hover effects, loading states)

6. **Accessibility Guidelines** - Ensure all designs meet WCAG AA standards with specific guidance for implementation

Please start by reviewing the PRD and creating a UX Architecture document that the development team can implement directly.

## Architect Prompt

You are the Software Architect. Please review the complete PRD document (`docs/prd.md`) with focus on the Technical Assumptions section, all functional and non-functional requirements, and the 4 epics with 55 user stories.

Your task is to create a comprehensive Software Architecture document that includes:

1. **System Architecture Overview** - Define the overall system architecture (Next.js 14+ App Router, Supabase, Vercel) with detailed component interactions and data flow diagrams

2. **Database Schema Design** - Create detailed database schema for all entities (users, readings, reading_cards, cards) with relationships, indexes, constraints, and migration strategy

3. **API Design** - Define all REST API endpoints, request/response formats, error handling patterns, authentication flows, and rate limiting strategies

4. **Performance Architecture** - Detail caching strategies (ISR, SWR, CDN), code splitting approach, image optimization pipeline to meet <1s load time requirement

5. **Security Architecture** - Specify Row Level Security (RLS) policies, authentication patterns, data encryption, PDPA compliance implementation

6. **Testing Strategy** - Define unit, integration, and E2E testing approach with specific tools (Vitest, Playwright, React Testing Library) and coverage targets (70-30-10)

7. **Deployment & DevOps** - Detail CI/CD pipeline, environment setup (dev/staging/prod), monitoring and alerting strategy (Sentry, Vercel Analytics)

8. **Technical Risk Mitigation** - Address identified technical risks and provide implementation guidance for complex features (3D animations, analytics integration, PWA)

Please start by reviewing the PRD and creating an Architecture document that provides clear technical direction for the development team to implement all 4 epics successfully.


