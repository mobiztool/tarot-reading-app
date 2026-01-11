# Introduction

This document outlines the complete fullstack architecture for **Web App ดูดวงไพ่ยิปซี**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

## Starter Template or Existing Project

**Decision:** Greenfield project - No starter template

**Rationale:** 
While there are excellent Next.js + Supabase starter templates available (e.g., Vercel's Next.js Supabase Starter), we've decided to build from scratch to:
1. Maintain full control over the architecture and avoid unnecessary boilerplate
2. Implement the exact tech stack specified in PRD without modifications
3. Optimize for the specific requirements of a tarot reading application (card animations, mystical UX, Thai language support)
4. Ensure clean codebase that AI agents can understand and extend without legacy code

The project will use industry-standard practices and patterns from Next.js 14 App Router and Supabase documentation, but built specifically for our use case.

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-12-30 | 0.1 | Initial Architecture document draft | Winston (Architect) |
| 2025-12-30 | 1.0 | Complete fullstack architecture with all sections | Winston (Architect) |
| 2025-12-30 | 1.1 | Added Content Quality Assurance Strategy (610 lines) | Quinn (QA) |
| 2025-12-30 | 1.2 | Added Content Pipeline Architecture + Anthropic Claude API integration | Winston (Architect) |

---
