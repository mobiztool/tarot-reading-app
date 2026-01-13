# Epic 4: Personalization & Enhanced UX

**Epic Goal:**

ปรับปรุงประสบการณ์ผู้ใช้ให้มี polish และ delight ผ่าน personalization features (theme selection, daily reminders, question input) และ enhance UX/UI ด้วย animations และ micro-interactions ที่สมบูรณ์ตามที่ออกแบบไว้ ทำให้ app รู้สึก premium และตอบสนองความต้องการส่วนบุคคลของแต่ละ user

Epic นี้เน้นการสร้าง emotional connection และ engagement ระยะยาวผ่าน personalized experiences ที่ทำให้ users รู้สึกว่า app "เข้าใจ" พวกเขา

---

## Story 4.1: Theme & Color Customization

**As a** user,  
**I want** to personalize the app's appearance,  
**so that** it feels more "mine" and matches my aesthetic preferences.

### Acceptance Criteria

1. Theme settings page (`/settings/theme`) or modal accessible from profile
2. Theme options: Dark Mystical (default), Light Ethereal, Deep Ocean, Cosmic Purple
3. Each theme includes: background colors, accent colors, card back designs
4. Theme preview: show sample cards and UI in each theme before applying
5. Theme persisted: saved in user profile (logged-in) or localStorage (anonymous)
6. Theme applies instantly: no page refresh needed, smooth transition
7. All pages support themes: consistent theming across entire app
8. Accessibility maintained: all themes meet WCAG AA contrast requirements
9. Theme selection analytics: track which themes most popular
10. Custom theme (future): allow users to pick custom accent color (color picker)

---

## Story 4.2: Daily Reading Reminder & Push Notifications

**As a** user,  
**I want** daily reminders to do my tarot reading,  
**so that** I build a consistent practice and stay engaged with the app.

### Acceptance Criteria

1. Reminder settings in user profile: toggle on/off, set preferred time
2. Time picker: user selects reminder time (e.g., 9:00 AM)
3. Timezone handling: reminders sent in user's local timezone
4. PWA push notifications: request permission, show notification at set time
5. Notification content: "[App Name]: Your daily card awaits ✨ Draw your card now"
6. Notification click: opens app directly to daily reading page
7. Notification frequency: once per day at specified time
8. Snooze option: "Remind me in 1 hour" (optional)
9. Notification analytics: track delivery rate, click-through rate, conversion to reading
10. Graceful degradation: if notifications not supported (iOS < 16.4), show in-app reminder instead
11. Unsubscribe easy: user can disable notifications anytime in settings
12. Email fallback: if push not available, offer email daily reminder (uses Epic 2 email infrastructure)

---

## Story 4.3: Question Input & Contextualized Readings

**As a** user,  
**I want** to ask a specific question before my reading,  
**so that** the interpretation feels more relevant to my situation.

### Acceptance Criteria

1. Question input field added to reading selection page (optional)
2. Placeholder text: "What guidance do you seek? (optional)"
3. Character limit: 500 characters max with counter
4. Question saved with reading: stored in database, shown in reading result and history
5. Contextualized interpretation: reading result page shows question at top
6. AI-enhanced interpretation (future): use question to provide more targeted advice (foundation ready)
7. Question privacy: only visible to user, never shared publicly
8. Question examples: show sample questions to inspire users ("Will I find love?", "Should I change careers?")
9. Skip option: question always optional, users can proceed without entering question
10. Question editing: in history, allow users to edit question for past readings
11. Analytics: track % of readings with questions, common question themes (NLP analysis future)

---

## Story 4.4: Advanced Card Animations & Micro-interactions

**As a** user,  
**I want** smooth, delightful animations throughout the app,  
**so that** the experience feels magical and premium.

### Acceptance Criteria

1. Card flip animation enhanced: 3D perspective, realistic flip with shadow
2. Card selection animation: cards gently float and shimmer when hovered/tapped
3. Page transitions: smooth fade or slide transitions between pages
4. Loading animations: mystical spinner or particle effects during loading
5. Button interactions: scale, color change, subtle glow on hover/press
6. Success animations: celebration confetti when reading completed (subtle)
7. Toast notifications: slide in from top with bounce effect
8. Scroll animations: parallax effect on landing page, fade-in on scroll
9. Haptic feedback: vibration on card selection, drawing, and important actions (mobile)
10. Performance: all animations 60fps, no jank on mid-range devices
11. Reduced motion: respect `prefers-reduced-motion` for accessibility (disable animations)
12. Animation library: use Framer Motion for React animation consistency
13. Subtle sound effects (optional): soft chime when card flips (can be muted in settings)

---

## Story 4.5: Enhanced Card Selection Experience

**As a** user,  
**I want** a more interactive and engaging card selection process,  
**so that** choosing cards feels meaningful and connected to my intuition.

### Acceptance Criteria

1. Fan layout: cards spread in arc/fan formation (desktop: full arc, mobile: partial)
2. Drag-to-select: user can drag card from deck to selection area
3. Swipe gestures: swipe left/right to browse through card deck (mobile)
4. Card hover effects: card lifts slightly and glows when hovered (desktop)
5. Selection feedback: selected card highlights with golden glow
6. Shuffle animation: deck shuffles visually before selection (optional, can skip)
7. Sound option: soft shuffling sound during shuffle (toggle on/off)
8. Guided selection: tooltip suggests "Choose the card that calls to you"
9. Selection timer (optional): gentle timer showing how long user has been selecting (no pressure)
10. Undo selection: allow user to deselect and choose different card
11. Multiple selection modes: tap to select OR drag-and-drop (user preference)
12. Performance: smooth on mobile devices, optimized touch interactions

---

## Story 4.6: Reading Journal & Personal Notes

**As a** logged-in user,  
**I want** to add personal notes to my readings,  
**so that** I can reflect on how the reading relates to my life.

### Acceptance Criteria

1. Notes section added to reading result page: text area below interpretation
2. Notes auto-save: save as user types (debounced, no manual save button)
3. Notes persist: saved to database, visible when reviewing past readings
4. Notes private: only user can see their notes (RLS enforced)
5. Rich text editing (basic): bold, italic, bullet points, links
6. Character limit: 2000 characters for notes
7. Edit notes anytime: can edit notes on historical readings
8. Notes search: in history page, search readings by note content
9. Export option: export reading with notes as PDF (future)
10. Notes analytics: track % of users who add notes (engagement metric)

---

## Story 4.7: Favorite Cards & Bookmarking

**As a** user,  
**I want** to bookmark favorite readings and cards,  
**so that** I can easily return to meaningful insights.

### Acceptance Criteria

1. Favorite/bookmark button on reading result pages: heart icon
2. Favorite button on card encyclopedia pages: bookmark specific cards
3. Favorites collection in profile: "My Favorites" section
4. Favorites list shows: bookmarked readings and cards, chronological or by date favorited
5. Unfavorite option: remove from favorites anytime
6. Favorites count: show "X favorites" in profile
7. Quick access: favorited items easily accessible from profile menu
8. Favorites analytics: most favorited cards, insights on user preferences
9. Favorites limit: no limit for logged-in users, encourage signup for anonymous users
10. Share favorites: "Share my favorite card" feature

---

## Story 4.8: Onboarding Tutorial Enhancement

**As a** first-time user,  
**I want** an interactive tutorial that shows me how to use the app,  
**so that** I feel confident and excited to start.

### Acceptance Criteria

1. Interactive tutorial: tooltip-based walkthrough on first visit
2. Tutorial steps (5 steps max):
   - Step 1: Welcome message
   - Step 2: "Choose your reading type"
   - Step 3: "Select your cards intuitively"
   - Step 4: "Discover your insights"
   - Step 5: "Save and share your readings"
3. Tooltips highlight: relevant UI elements as tutorial progresses
4. Skip option: "Skip tutorial" button visible at all times
5. Tutorial progress: dots showing progress (step 2/5)
6. Tutorial replay: "Replay tutorial" option in settings/help
7. Tutorial completion: "You're all set! ✨" final message
8. Tutorial analytics: track completion rate, drop-off points
9. Adaptive tutorial: different tutorial for logged-in vs anonymous users
10. Mobile optimized: tutorial works seamlessly on mobile devices

---

## Story 4.9: Accessibility Enhancements

**As a** user with accessibility needs,  
**I want** the app to be fully accessible,  
**so that** I can use all features regardless of my abilities.

### Acceptance Criteria

1. Keyboard navigation: all interactive elements accessible via Tab key
2. Focus indicators: visible focus outline on all focusable elements
3. Screen reader support: ARIA labels on all buttons, images, sections
4. Semantic HTML: proper heading hierarchy (H1, H2, H3), landmarks (nav, main, aside)
5. Alt text: all images have descriptive alt text
6. Color contrast: all text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
7. Form labels: all input fields have proper labels
8. Error messages: clear, descriptive error messages announced by screen readers
9. Skip links: "Skip to main content" link for keyboard users
10. Reduced motion: animations disabled when `prefers-reduced-motion` set
11. Text resizing: app remains usable when text size increased to 200%
12. Touch targets: all buttons/links ≥44×44px for easy tapping
13. Accessibility audit: passes WAVE and axe DevTools audits with no errors
14. User testing: test with actual users who use assistive technologies

---

## Story 4.10: Performance & Polish Final Pass

**As a** user,  
**I want** the app to feel fast, smooth, and polished in every interaction,  
**so that** my experience is consistently excellent.

### Acceptance Criteria

1. Lighthouse scores: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95 (all pages)
2. Core Web Vitals: LCP <1.5s, FID <100ms, CLS <0.1 (all pages meet targets)
3. Animation performance: all animations 60fps, no dropped frames
4. Image optimization: all images WebP, properly sized, lazy loaded
5. Code splitting optimized: minimal JavaScript on initial load
6. Bundle size: JavaScript bundle <200KB gzipped
7. Font loading: fonts load without FOUT/FOIT (flash of unstyled/invisible text)
8. Error handling polish: all error states have friendly messages and recovery options
9. Empty states polish: all empty states have helpful illustrations and CTAs
10. Loading states polish: consistent loading indicators throughout app
11. Visual consistency: UI components consistent across all pages (spacing, colors, typography)
12. Cross-browser testing: works perfectly on all supported browsers
13. Mobile gestures: swipe, pinch, scroll all work naturally
14. Production-ready: no console errors or warnings in production build

---

## Story 4.11: Help Center & Documentation

**As a** user who needs help,  
**I want** easy access to support resources,  
**so that** I can solve problems quickly without frustration.

### Acceptance Criteria

1. Help Center page (`/help`) with common topics and FAQs
2. FAQ categories: Getting Started, Account, Readings, Privacy, Technical Issues
3. 15-20 FAQ entries covering most common questions
4. Search FAQs: find relevant help articles quickly
5. Contact support: form or email link for issues not covered in FAQs
6. Video tutorials (optional): short videos showing how to use key features
7. Troubleshooting guide: common issues and solutions
8. Privacy policy page: comprehensive, PDPA-compliant privacy policy
9. Terms of service page: clear terms and conditions
10. Help button: accessible from all pages (footer or floating button)
11. Contextual help: tooltips and help icons next to confusing features
12. Help analytics: track most viewed help articles, search queries
13. Feedback option: "Was this helpful?" on each FAQ

---

## Story 4.12: Epic 4 Testing & Quality Assurance

**As a** QA tester,  
**I want** comprehensive testing of all personalization and UX enhancements,  
**so that** we ship a polished, delightful final product.

### Acceptance Criteria

1. Full regression testing: all features from Epics 1-4 tested
2. Theme testing: verify all themes work correctly, no visual glitches
3. Animation testing: verify animations smooth on various devices (iPhone 12, Pixel 6, etc.)
4. Notification testing: push notifications deliver correctly, respect user preferences
5. Accessibility testing: WCAG AA compliance verified with automated tools and manual testing
6. Performance testing: Lighthouse audits pass on all major pages
7. Cross-device testing: iPhone, Android, tablets, desktop browsers
8. Usability testing: 5-10 users test new features, provide feedback
9. Edge case testing: test with various user settings combinations
10. Analytics verification: all new tracking events fire correctly
11. All P0, P1, and P2 bugs fixed before shipping
12. Final QA sign-off: QA lead approves release
13. Smoke test: quick verification of critical paths after deployment
14. User acceptance testing: product owner approves all features

---
