# Epic 2: User Account & Reading History

**Epic Goal:**

เพิ่มความสามารถในการสร้างบัญชีผู้ใช้และ login เข้าสู่ระบบ เพื่อให้ผู้ใช้สามารถบันทึกและเข้าถึงประวัติการดูดวงทั้งหมดได้ทุกที่ทุกเวลา สร้าง user retention และเป็น foundation สำหรับ freemium model ในอนาคต โดยรักษาประสบการณ์ที่ราบรื่น - anonymous users ยังคงใช้ได้ตามปกติ และสามารถสมัครสมาชิกได้เมื่อต้องการเก็บประวัติ

Epic นี้เพิ่ม value ให้ผู้ใช้ที่ต้องการติดตามการดูดวงย้อนหลัง เปรียบเทียบผล และสร้าง engagement ระยะยาว

---

## Story 2.1: User Authentication with Supabase Auth

**As a** new user,  
**I want** to sign up for an account easily using email or social login,  
**so that** I can save my readings and access them later from any device.

### Acceptance Criteria

1. Supabase Auth configured with email/password authentication enabled
2. Sign up page (`/auth/signup`) created with form: email, password, confirm password, terms acceptance checkbox
3. Email validation: proper format, not already registered
4. Password validation: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
5. Password strength indicator displayed (weak/medium/strong)
6. "Sign up with Google" button integrated (Supabase OAuth Google provider)
7. "Sign up with Facebook" button integrated (Supabase OAuth Facebook provider)
8. Email verification: Supabase sends confirmation email, user must verify before full access
9. Sign up success: user redirected to profile page or previous page they were on
10. Error handling: display clear messages for duplicate email, weak password, network errors
11. Terms of service and privacy policy links included (placeholder pages)
12. PDPA compliance: consent checkbox for data collection
13. Analytics tracked: `signup_started`, `signup_completed`, `signup_method` (email/google/facebook)

---

## Story 2.2: User Login & Session Management

**As a** returning user,  
**I want** to login quickly and stay logged in,  
**so that** I don't have to re-authenticate every time I visit the app.

### Acceptance Criteria

1. Login page (`/auth/login`) created with form: email, password
2. "Login with Google" and "Login with Facebook" buttons available
3. "Remember me" checkbox keeps user logged in for 30 days
4. "Forgot password?" link navigates to password reset flow
5. Successful login: user redirected to previous page or home page
6. Session persisted using Supabase Auth tokens (stored in localStorage or cookies)
7. Session refresh: automatically refresh token before expiration (no logout)
8. Error handling: invalid credentials show "Email or password incorrect" message
9. Rate limiting: prevent brute force attacks (max 5 attempts per 15 minutes)
10. Logout functionality: "Logout" button in navigation, clears session and redirects to home
11. Protected routes: redirect to login if user tries to access history/profile without authentication
12. Auto-login: if user has valid session, skip login and show logged-in state
13. Analytics tracked: `login_completed`, `login_method`, `logout_completed`

---

## Story 2.3: Password Reset Flow

**As a** user who forgot my password,  
**I want** to reset it via email,  
**so that** I can regain access to my account without contacting support.

### Acceptance Criteria

1. Password reset request page (`/auth/forgot-password`) created with email input field
2. User submits email, Supabase sends password reset email
3. Success message: "Password reset link sent to your email" (even if email not found - security)
4. Reset email contains magic link valid for 1 hour
5. Clicking link redirects to password reset page (`/auth/reset-password`) with token
6. Reset password page: new password input, confirm password input, submit button
7. Password validation: same rules as signup (8+ chars, mixed case, number)
8. Successful reset: password updated, user auto-logged in, redirected to profile
9. Expired token: show "Reset link expired, request a new one" message
10. Analytics tracked: `password_reset_requested`, `password_reset_completed`

---

## Story 2.4: User Profile Page & Settings

**As a** logged-in user,  
**I want** to view and edit my profile information,  
**so that** I can keep my account details up to date.

### Acceptance Criteria

1. Profile page (`/profile`) created with user information display
2. Displays: profile picture (placeholder or from OAuth), name, email, account created date
3. Edit profile form: update name, upload profile picture (optional)
4. Profile picture upload: max 2MB, formats: JPG, PNG, stored in Supabase Storage
5. Email change: requires re-verification (security measure)
6. Password change: current password, new password, confirm password fields
7. Account deletion option: "Delete my account" button with confirmation modal
8. Account deletion: permanently delete user data, readings, and logout
9. Settings section: email preferences (daily reminder - placeholder for Epic 4)
10. Success messages: "Profile updated successfully"
11. Validation: proper error messages for invalid inputs
12. Mobile responsive: profile page works well on all screen sizes
13. Analytics tracked: `profile_updated`, `account_deleted`

---

## Story 2.5: Database Schema for Users & Readings Association

**As a** developer,  
**I want** user readings properly associated with user accounts,  
**so that** we can retrieve user-specific reading history efficiently.

### Acceptance Criteria

1. `users` table schema: `id` (UUID from Supabase Auth), `email`, `name`, `profile_picture_url`, `created_at`, `last_login_at`
2. `readings` table updated: `user_id` (foreign key to users, nullable for anonymous)
3. Database migration created and applied to add user_id column to existing readings
4. Prisma schema updated with User model and relationships
5. Row Level Security (RLS) policies: users can only read/write their own data
6. Index created on `readings.user_id` for fast queries
7. Cascade delete rule: if user deleted, associated readings also deleted (or anonymized)
8. Anonymous readings: readings created before login have `user_id = NULL`
9. Reading claiming: when anonymous user signs up, option to claim previous readings (bonus feature)
10. Database queries tested: fetch user readings, create reading with user_id, update user profile

---

## Story 2.6: Reading History Page

**As a** logged-in user,  
**I want** to see all my past readings in one place,  
**so that** I can review previous insights and track patterns over time.

### Acceptance Criteria

1. Reading History page (`/history`) created, accessible only to logged-in users
2. Displays list of all user's readings in reverse chronological order (newest first)
3. Each reading item shows: date, reading type (Daily/3-Card), question (if provided), thumbnail of first card
4. Pagination or infinite scroll: load 20 readings at a time for performance
5. Filter options: "All readings", "Daily readings", "3-Card spreads"
6. Date range filter: "Last 7 days", "Last 30 days", "All time"
7. Search functionality: search by question text (future enhancement - basic version)
8. Empty state: if no readings, show "You haven't done any readings yet" with CTA button
9. Clicking reading item navigates to reading detail page
10. Mobile responsive: list view optimized for mobile with swipe gestures (optional)
11. Loading state: skeleton screens while fetching readings
12. Analytics tracked: `history_viewed`, `history_filter_used`, `reading_reopened`

---

## Story 2.7: Reading Detail Page for Past Readings

**As a** logged-in user,  
**I want** to view full details of any past reading,  
**so that** I can revisit the interpretation and reflect on the guidance.

### Acceptance Criteria

1. Reading detail page (`/reading/[id]`) displays full reading with same layout as original result page
2. Shows: date and time of reading, reading type, question (if provided), all cards drawn
3. Cards displayed with full interpretations as shown originally
4. Immutable view: cannot re-draw or change cards (this is historical record)
5. Action buttons: "Share" (Epic 3), "Delete reading", "Back to history"
6. Delete reading: confirmation modal, permanently removes reading from history
7. URL shareable: can copy link and access from different device (if logged in)
8. 404 error: if reading ID doesn't exist or doesn't belong to user
9. Permission check: users can only view their own readings (RLS enforced)
10. Analytics tracked: `reading_detail_viewed`, `reading_deleted`

---

## Story 2.8: Onboarding Flow for New Sign-ups

**As a** new user who just signed up,  
**I want** a brief welcome experience,  
**so that** I understand what benefits I get from having an account.

### Acceptance Criteria

1. Post-signup welcome screen or modal shows after first login
2. Welcome message: "Welcome to [App Name]! Your readings are now saved automatically."
3. Benefit highlights: "Access your readings anytime", "Track your journey", "Unlock premium features soon"
4. Optional profile completion: "Add your name and profile picture" (skippable)
5. CTA button: "Start my first reading" navigates to reading selection
6. Onboarding shown only once: flag stored in user profile or localStorage
7. Skip option: "Skip for now" closes onboarding, can access later from profile
8. Mobile friendly: onboarding works well on mobile screens
9. Analytics tracked: `onboarding_completed`, `onboarding_skipped`

---

## Story 2.9: Anonymous to Authenticated User Conversion

**As an** anonymous user who has already done readings,  
**I want** to be prompted to sign up to save my readings,  
**so that** I don't lose my reading history.

### Acceptance Criteria

1. After 2nd or 3rd reading, show signup prompt: "Sign up to save your readings"
2. Prompt displayed as modal or banner (non-intrusive)
3. Dismiss option: user can close prompt and continue as anonymous
4. Prompt frequency: show maximum once per day (don't annoy users)
5. CTA buttons: "Sign up now" (navigates to signup), "Maybe later" (dismisses)
6. Value proposition clear: "Don't lose your readings. Sign up for free."
7. If user signs up, attempt to claim previous anonymous readings (match by device/session)
8. Reading claiming: update `user_id` for readings from same browser session
9. Claimed readings appear in user's history immediately after signup
10. Analytics tracked: `signup_prompt_shown`, `signup_from_prompt`, `readings_claimed_count`

---

## Story 2.10: Navigation & User State Display

**As a** user (logged in or anonymous),  
**I want** to see my login status in the navigation,  
**so that** I can easily access my profile or login when needed.

### Acceptance Criteria

1. Navigation header updated: shows different state for logged-in vs anonymous users
2. Anonymous user: "Login" and "Sign up" buttons in header
3. Logged-in user: profile icon/avatar with dropdown menu
4. Dropdown menu items: "Profile", "History", "Settings", "Logout"
5. Profile icon shows first letter of name or profile picture if uploaded
6. Mobile: hamburger menu includes auth-related items appropriately
7. Active state: current page highlighted in navigation
8. Smooth transitions: login state updates immediately after authentication (no page refresh)
9. Persistent across pages: auth state maintained during navigation
10. Loading state: skeleton or placeholder while checking auth status on initial load

---

## Story 2.11: Reading Permissions & Privacy

**As a** user,  
**I want** my readings to be private and secure,  
**so that** no one else can access my personal tarot reading history.

### Acceptance Criteria

1. Row Level Security (RLS) policies enabled on Supabase for `readings` and `users` tables
2. RLS policy: users can only SELECT, UPDATE, DELETE their own readings (`user_id = auth.uid()`)
3. Anonymous readings (user_id = NULL) readable by anyone with reading ID (if needed for sharing)
4. API routes validate authentication: return 401 Unauthorized for protected endpoints
5. Reading URLs: `/reading/[id]` checks ownership before displaying
6. Database queries: always filter by user_id when fetching readings
7. Security testing: attempt to access other user's reading → receives 403 Forbidden
8. Privacy policy updated: explain data collection, storage, and user rights (PDPA compliance)
9. User data encryption: sensitive fields encrypted at rest (Supabase handles this)
10. No data leakage: error messages don't reveal information about other users

---

## Story 2.12: User Analytics & Retention Metrics

**As a** product manager,  
**I want** to track user behavior and retention,  
**so that** we can measure the success of the authentication feature and optimize for growth.

### Acceptance Criteria

1. Analytics events implemented for all user actions: signup, login, logout, profile update
2. Cohort tracking: new users tagged by signup date for retention analysis
3. User properties in GA4: user_id (hashed), signup_method, account_age, readings_count
4. Funnel tracking: landing → signup prompt → signup → first reading as logged-in user
5. Retention metrics: track DAU (Daily Active Users), WAU, MAU for logged-in users
6. Engagement metrics: readings per user, days since last reading, reading frequency
7. Conversion rate: anonymous users → signed up users (%)
8. Privacy compliant: no PII (personally identifiable information) sent to analytics
9. Dashboard (future): Vercel Analytics or PostHog dashboard showing key metrics
10. A/B test ready: infrastructure to test different signup prompts or flows (foundation only)

---

## Story 2.13: Email Notifications Setup (Foundation)

**As a** developer,  
**I want** email notification infrastructure in place,  
**so that** we can send transactional emails and future marketing emails.

### Acceptance Criteria

1. Email service integrated: Supabase Email (default) or SendGrid/Resend for better deliverability
2. Email templates created: welcome email, password reset, email verification
3. Email templates branded: includes app logo, mystical theme colors, consistent styling
4. Welcome email sent automatically after signup: "Welcome to [App Name]"
5. Email verification email: includes magic link to confirm email address
6. Password reset email: includes secure reset link valid for 1 hour
7. Email deliverability tested: emails land in inbox, not spam
8. Unsubscribe link included in all emails (future marketing emails)
9. Email tracking: open rates, click rates tracked via SendGrid/Resend (optional)
10. Foundation for Epic 4: daily reminder emails (infrastructure ready, not yet implemented)

---

## Story 2.14: Performance & Security Optimization

**As a** developer,  
**I want** authentication to be fast and secure,  
**so that** users have a smooth experience and their data is protected.

### Acceptance Criteria

1. Auth state persistence: use secure HTTP-only cookies for token storage (more secure than localStorage)
2. Token refresh logic: automatically refresh access token before expiration
3. Session timeout: inactive users logged out after 30 days (configurable)
4. HTTPS enforced: all authentication endpoints use HTTPS in production
5. CORS properly configured: only allow requests from app domain
6. Rate limiting on auth endpoints: prevent brute force attacks (max 5 login attempts per 15 min)
7. Input sanitization: prevent SQL injection, XSS attacks on all form inputs
8. Password hashing: Supabase uses bcrypt (verify configuration)
9. Auth performance: login completes in <1 second, no noticeable delay
10. Error logging: all auth errors logged to Sentry for monitoring and debugging

---

## Story 2.15: Epic 2 Testing & Quality Assurance

**As a** QA tester,  
**I want** comprehensive testing of all authentication and history features,  
**so that** we ship a stable, secure feature set that users can trust.

### Acceptance Criteria

1. Functional testing: all user stories tested manually on mobile and desktop
2. E2E tests: critical flows automated with Playwright:
   - Full signup flow (email + password)
   - Login and logout flow
   - Password reset flow
   - View reading history
   - Delete reading
3. Security testing: attempt unauthorized access, test RLS policies, verify token security
4. Cross-browser testing: Safari iOS, Chrome Android, Desktop browsers
5. Accessibility testing: forms usable with keyboard, screen reader compatible
6. Performance testing: auth operations complete in <1s, history loads quickly
7. Edge cases tested: weak passwords, duplicate emails, expired tokens, network failures
8. Integration testing: Supabase Auth integration verified in staging environment
9. Email deliverability: test emails received and formatted correctly
10. Regression testing: Epic 1 features still work correctly with Epic 2 changes
11. All P0 and P1 bugs fixed before shipping
12. Known issues documented and prioritized for future fixes

---
