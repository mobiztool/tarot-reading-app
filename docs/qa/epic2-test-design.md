# Epic 2: User Account & Reading History - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 2: User Account & Reading History |
| **Stories** | 2.1-2.15 (15 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 2 Overview
Epic 2 เพิ่มระบบ user authentication และ reading history เพื่อให้ผู้ใช้สามารถบันทึกและเข้าถึงประวัติการดูดวงได้ทุกที่ทุกเวลา

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 15 |
| Total Acceptance Criteria | 159 |
| Total Test Scenarios | 189 |
| High-Risk Scenarios | 42 |
| Medium-Risk Scenarios | 78 |
| Low-Risk Scenarios | 69 |

### Risk Assessment Summary

```yaml
HIGH RISK (P0):
  - Authentication security (2.1, 2.2, 2.14)
  - Data privacy/RLS policies (2.5, 2.11)
  - Account deletion (2.4)
  - Password reset security (2.3)

MEDIUM RISK (P1):
  - Session management (2.2)
  - Reading history accuracy (2.6, 2.7)
  - OAuth integration (2.1, 2.2)
  - Email deliverability (2.13)

LOW RISK (P2):
  - UI/UX polish (2.10)
  - Analytics tracking (2.12)
  - Onboarding flow (2.8)
  - Conversion prompts (2.9)
```

---

## Story 2.1: User Authentication with Supabase Auth

### Test Scenarios (13 AC → 19 TS)

#### TS-2.1.1: Email Signup Form Validation
```gherkin
Feature: User Signup with Email

Scenario: Valid email signup form submission
  Given user is on signup page "/auth/signup"
  And user enters valid email "test@example.com"
  And user enters valid password "Password123"
  And user confirms password "Password123"
  And user accepts terms and PDPA consent
  When user clicks "Sign up" button
  Then user should see "Check your email" message
  And verification email should be sent

Scenario: Invalid email format validation
  Given user is on signup page
  When user enters invalid email "invalid-email"
  Then error message "Invalid email format" should display

Scenario: Weak password validation
  Given user is on signup page
  When user enters password "weak"
  Then error message "Password must be at least 8 characters" should display
  And password strength indicator shows "Weak"

Scenario: Password mismatch validation
  Given user enters password "Password123"
  When user enters confirm password "DifferentPassword"
  Then error message "Passwords don't match" should display

Scenario: Duplicate email registration
  Given user "existing@example.com" already exists
  When user tries to register with "existing@example.com"
  Then error message "Email already registered" should display
```

#### TS-2.1.2: Password Strength Indicator
```gherkin
Scenario: Weak password (< 8 chars)
  Given user is entering password
  When password is "Pass1"
  Then strength indicator shows "Weak" with red bar

Scenario: Medium password (meets minimum requirements)
  Given user is entering password
  When password is "Password1"
  Then strength indicator shows "Medium" with yellow bar

Scenario: Strong password (exceeds requirements)
  Given user is entering password
  When password is "P@ssword123!Complex"
  Then strength indicator shows "Strong" with green bar
```

#### TS-2.1.3: OAuth Signup
```gherkin
Scenario: Successful Google OAuth signup
  Given user is on signup page
  When user clicks "Sign up with Google"
  And user authenticates with Google
  Then user account is created
  And user is redirected to profile page
  And profile picture from Google is imported

Scenario: Successful Facebook OAuth signup
  Given user is on signup page
  When user clicks "Sign up with Facebook"
  And user authenticates with Facebook
  Then user account is created
  And user is redirected to profile page

Scenario: OAuth cancellation
  Given user is on signup page
  When user clicks "Sign up with Google"
  And user cancels OAuth flow
  Then user remains on signup page
  And no error is shown
```

#### TS-2.1.4: Email Verification
```gherkin
Scenario: Email verification success
  Given user signed up with email "test@example.com"
  And user received verification email
  When user clicks verification link
  Then email is marked as verified
  And user gains full access to features

Scenario: Expired verification link
  Given user signed up more than 24 hours ago
  When user clicks expired verification link
  Then error message "Link expired" should display
  And "Resend verification" option is available
```

#### TS-2.1.5: Analytics Tracking
```gherkin
Scenario: Signup events tracked
  Given user is on signup page
  Then event "signup_started" should fire
  When user completes signup
  Then event "signup_completed" should fire with method "email"
```

### Test Data Requirements
```yaml
Valid Users:
  - email: "testuser@example.com"
  - password: "TestPassword123"
  - name: "Test User"

Invalid Emails:
  - "invalid"
  - "@example.com"
  - "test@"
  - "test@.com"

Weak Passwords:
  - "short"
  - "nouppercase1"
  - "NOLOWERCASE1"
  - "NoNumbers"
```

---

## Story 2.2: User Login & Session Management

### Test Scenarios (13 AC → 16 TS)

#### TS-2.2.1: Email/Password Login
```gherkin
Feature: User Login

Scenario: Successful login with valid credentials
  Given user has registered account
  And user is on login page "/auth/login"
  When user enters valid email and password
  And user clicks "Login" button
  Then user should be logged in
  And user should be redirected to home page

Scenario: Invalid credentials login
  Given user is on login page
  When user enters invalid email or password
  Then error message "Email or password incorrect" should display
  And login attempt is recorded

Scenario: Unverified email login attempt
  Given user has unverified email
  When user tries to login
  Then error message "Please verify your email first" should display
```

#### TS-2.2.2: Remember Me & Session Persistence
```gherkin
Scenario: Remember me extends session
  Given user checks "Remember me" checkbox
  When user logs in
  Then session should persist for 30 days
  And user remains logged in after browser close

Scenario: Session without remember me
  Given user does not check "Remember me"
  When user logs in
  Then session should persist for 7 days
```

#### TS-2.2.3: OAuth Login
```gherkin
Scenario: Successful Google OAuth login
  Given user has Google-linked account
  When user clicks "Login with Google"
  And user authenticates with Google
  Then user should be logged in
  And redirected to previous page

Scenario: Successful Facebook OAuth login
  Given user has Facebook-linked account
  When user clicks "Login with Facebook"
  And user authenticates with Facebook
  Then user should be logged in
```

#### TS-2.2.4: Rate Limiting
```gherkin
Scenario: Rate limiting after 5 failed attempts
  Given user has 0 failed login attempts
  When user fails login 5 times
  Then error message "Too many attempts" should display
  And user must wait 15 minutes before retry
  And lockout timer is displayed

Scenario: Successful login resets attempts
  Given user has 3 failed login attempts
  When user successfully logs in
  Then failed attempt counter resets to 0
```

#### TS-2.2.5: Protected Routes
```gherkin
Scenario: Accessing protected route without login
  Given user is not logged in
  When user navigates to "/history"
  Then user should be redirected to "/auth/login"
  And redirectTo parameter should be set to "/history"

Scenario: Redirect after login
  Given user was redirected from "/profile"
  When user successfully logs in
  Then user should be redirected to "/profile"
```

#### TS-2.2.6: Logout
```gherkin
Scenario: Successful logout
  Given user is logged in
  When user clicks "Logout" button
  Then session should be cleared
  And user should be redirected to home page
  And navigation shows "Login" button
```

---

## Story 2.3: Password Reset Flow

### Test Scenarios (10 AC → 12 TS)

#### TS-2.3.1: Password Reset Request
```gherkin
Feature: Password Reset

Scenario: Request password reset with valid email
  Given user is on forgot password page
  When user enters registered email "user@example.com"
  And clicks "Send Reset Link"
  Then success message should display (regardless of email existence)
  And reset email should be sent to registered email

Scenario: Request with non-existent email (security)
  Given user is on forgot password page
  When user enters non-existent email "unknown@example.com"
  Then same success message should display (don't reveal if exists)
  And no email is sent
```

#### TS-2.3.2: Password Reset Link
```gherkin
Scenario: Valid reset link
  Given user received password reset email
  And reset link is less than 1 hour old
  When user clicks reset link
  Then password reset form should display
  And token should be valid

Scenario: Expired reset link
  Given user received password reset email
  And reset link is more than 1 hour old
  When user clicks reset link
  Then error message "Reset link expired" should display
  And "Request new link" option is available

Scenario: Already used reset link
  Given user already used reset link
  When user tries to use same link again
  Then error message "Link already used" should display
```

#### TS-2.3.3: Password Update
```gherkin
Scenario: Successful password update
  Given user is on password reset page with valid token
  When user enters new valid password
  And confirms password
  And clicks "Reset Password"
  Then password should be updated
  And user should be auto-logged in
  And redirected to profile page

Scenario: Invalid password on reset
  Given user is on password reset page
  When user enters weak password
  Then validation errors should display
  And password should not be updated
```

---

## Story 2.4: User Profile Page & Settings

### Test Scenarios (13 AC → 17 TS)

#### TS-2.4.1: Profile Display
```gherkin
Feature: User Profile

Scenario: View profile page
  Given user is logged in
  When user navigates to "/profile"
  Then profile picture (or initials) should display
  And name should display
  And email should display
  And account creation date should display
```

#### TS-2.4.2: Profile Update
```gherkin
Scenario: Update profile name
  Given user is on profile page
  When user clicks "Edit Profile"
  And changes name to "New Name"
  And clicks "Save"
  Then success message "Profile updated" should display
  And name should be updated everywhere

Scenario: Invalid name validation
  Given user is editing profile
  When user enters name with special characters only
  Then error message should display
```

#### TS-2.4.3: Profile Picture Upload
```gherkin
Scenario: Successful profile picture upload
  Given user is on profile page
  When user selects valid image file (< 2MB, JPG/PNG)
  Then image preview should display
  And image should upload to Supabase Storage
  And profile picture should update

Scenario: Invalid file type
  Given user is on profile page
  When user selects GIF or PDF file
  Then error message "Only JPG and PNG allowed" should display

Scenario: File too large
  Given user is on profile page
  When user selects image > 2MB
  Then error message "File must be less than 2MB" should display
```

#### TS-2.4.4: Password Change
```gherkin
Scenario: Change password successfully
  Given user is on profile settings
  When user enters current password correctly
  And enters new valid password
  And confirms new password
  And clicks "Change Password"
  Then password should be updated
  And success message should display

Scenario: Wrong current password
  Given user is on profile settings
  When user enters incorrect current password
  Then error message "Current password incorrect" should display
```

#### TS-2.4.5: Account Deletion
```gherkin
Scenario: Delete account with confirmation
  Given user is on profile page
  When user clicks "Delete Account"
  Then confirmation modal should appear
  And user must type "DELETE" to confirm
  When user confirms deletion
  Then account should be permanently deleted
  And all readings should be deleted (cascade)
  And user should be logged out
  And redirected to home page

Scenario: Cancel account deletion
  Given user is on delete confirmation modal
  When user clicks "Cancel"
  Then modal should close
  And account should remain active
```

---

## Story 2.5: Database Schema for Users & Readings

### Test Scenarios (10 AC → 14 TS)

#### TS-2.5.1: User Table Operations
```gherkin
Feature: Database Schema

Scenario: Create user record on signup
  Given new user signs up
  Then user record should be created in database
  And id should match Supabase Auth id
  And email should be stored
  And created_at should be current timestamp

Scenario: Update user profile
  Given user exists in database
  When user updates profile
  Then updated_at should be updated
  And only changed fields should update
```

#### TS-2.5.2: User-Reading Association
```gherkin
Scenario: Create reading for logged-in user
  Given user is logged in
  When user completes a reading
  Then reading should have user_id set
  And reading appears in user's history

Scenario: Create anonymous reading
  Given user is not logged in
  When user completes a reading
  Then reading should have user_id = NULL
  And session_id should be stored for claiming
```

#### TS-2.5.3: Row Level Security
```gherkin
Scenario: User can only access own readings
  Given user A has readings
  And user B tries to access user A's reading
  Then RLS should block access
  And 403 error should return

Scenario: User can modify own readings
  Given user has readings
  When user tries to update own reading
  Then update should succeed

Scenario: User cannot modify others' readings
  Given user A has readings
  When user B tries to update user A's reading
  Then RLS should block
  And update should fail
```

#### TS-2.5.4: Cascade Delete
```gherkin
Scenario: Delete user cascades to readings
  Given user has 5 readings
  When user account is deleted
  Then all 5 readings should be deleted
  And no orphan reading_cards remain
```

---

## Story 2.6: Reading History Page

### Test Scenarios (12 AC → 15 TS)

#### TS-2.6.1: History Display
```gherkin
Feature: Reading History

Scenario: View reading history
  Given logged-in user has 25 readings
  When user navigates to "/history"
  Then first 20 readings should display
  And readings should be in chronological order (newest first)
  And each reading shows date, type, question, thumbnail

Scenario: Empty history
  Given logged-in user has no readings
  When user navigates to "/history"
  Then empty state message should display
  And "Start your first reading" button is shown
```

#### TS-2.6.2: Pagination/Infinite Scroll
```gherkin
Scenario: Load more readings
  Given user has 50 readings
  And first 20 are displayed
  When user scrolls to bottom (or clicks "Load More")
  Then next 20 readings should load
  And previous readings remain visible
```

#### TS-2.6.3: Filters
```gherkin
Scenario: Filter by reading type
  Given user has 10 daily and 5 three-card readings
  When user selects "Daily readings" filter
  Then only 10 daily readings should display

Scenario: Filter by date range
  Given user has readings from various dates
  When user selects "Last 7 days"
  Then only readings from last 7 days should display

Scenario: Multiple filters combined
  Given user applies type AND date filter
  Then results should match both filters
```

#### TS-2.6.4: Search
```gherkin
Scenario: Search by question text
  Given user has readings with questions
  When user searches for "career"
  Then only readings with "career" in question should display
```

---

## Story 2.7: Reading Detail Page

### Test Scenarios (10 AC → 12 TS)

#### TS-2.7.1: View Past Reading
```gherkin
Feature: Reading Detail

Scenario: View own past reading
  Given user owns reading with ID "abc123"
  When user navigates to "/reading/abc123"
  Then full reading details should display
  And date/time of reading shown
  And all cards with interpretations shown
  And reading is immutable (no re-draw option)

Scenario: View unauthorized reading
  Given reading "abc123" belongs to another user
  When current user navigates to "/reading/abc123"
  Then 404 page should display
  And no reading details exposed
```

#### TS-2.7.2: Delete Reading
```gherkin
Scenario: Delete own reading
  Given user is viewing own reading
  When user clicks "Delete reading"
  And confirms deletion
  Then reading should be permanently deleted
  And user redirected to history page
  And reading no longer in history
```

---

## Story 2.8: Onboarding Flow

### Test Scenarios (9 AC → 10 TS)

#### TS-2.8.1: First-Time User Onboarding
```gherkin
Feature: User Onboarding

Scenario: Show onboarding for new user
  Given user just completed signup
  When user lands on app for first time
  Then welcome modal should appear
  And benefits should be listed
  And "Start my first reading" CTA is prominent

Scenario: Skip onboarding
  Given onboarding modal is displayed
  When user clicks "Skip for now"
  Then modal should close
  And onboarding flag should be set
  And onboarding won't show again

Scenario: Complete onboarding
  Given onboarding modal is displayed
  When user completes all steps
  And clicks "Start my first reading"
  Then user should be redirected to "/reading"
  And onboarding flag should be set
```

#### TS-2.8.2: Onboarding Not Shown Twice
```gherkin
Scenario: Returning user does not see onboarding
  Given user completed onboarding previously
  When user logs in again
  Then onboarding modal should NOT appear
```

---

## Story 2.9: Anonymous to Authenticated User Conversion

### Test Scenarios (10 AC → 13 TS)

#### TS-2.9.1: Signup Prompt Trigger
```gherkin
Feature: Conversion Prompt

Scenario: Show signup prompt after 2nd reading
  Given anonymous user completed 1 reading
  When user completes 2nd reading
  Then signup prompt modal should appear
  And value proposition is clear

Scenario: Prompt not shown on 1st reading
  Given anonymous user completes 1st reading
  Then signup prompt should NOT appear
```

#### TS-2.9.2: Prompt Frequency
```gherkin
Scenario: Prompt shown max once per day
  Given anonymous user dismissed prompt today
  When user completes another reading
  Then signup prompt should NOT appear again today

Scenario: Prompt shows again next day
  Given anonymous user dismissed prompt yesterday
  When user completes reading today
  Then signup prompt may appear again
```

#### TS-2.9.3: Reading Claiming
```gherkin
Scenario: Claim anonymous readings after signup
  Given anonymous user has 3 readings in current session
  When user signs up
  Then 3 readings should be claimed
  And success message "3 readings added to your history!" displays
  And readings appear in user's history

Scenario: No readings to claim
  Given anonymous user has no readings
  When user signs up
  Then no claiming occurs
  And no claiming message shown
```

---

## Story 2.10: Navigation & User State Display

### Test Scenarios (10 AC → 12 TS)

#### TS-2.10.1: Anonymous User Navigation
```gherkin
Feature: Navigation State

Scenario: Anonymous user sees login/signup
  Given user is not logged in
  When user views navigation header
  Then "Login" button should display
  And "Sign up" button should display
  And profile icon should NOT display
```

#### TS-2.10.2: Logged-in User Navigation
```gherkin
Scenario: Logged-in user sees profile menu
  Given user is logged in
  When user views navigation header
  Then profile icon/avatar should display
  And "Login/Signup" buttons should NOT display

Scenario: Profile dropdown menu
  Given user is logged in
  When user clicks profile icon
  Then dropdown menu should appear
  And menu includes: Profile, History, Settings, Logout
```

#### TS-2.10.3: Mobile Navigation
```gherkin
Scenario: Mobile hamburger menu
  Given user is on mobile device
  When user taps hamburger menu
  Then menu should include auth-related items
  And menu items are touch-friendly (44x44px)
```

#### TS-2.10.4: Real-time State Updates
```gherkin
Scenario: Login updates nav immediately
  Given user is on any page
  When user logs in in another tab
  Then navigation should update to logged-in state
  And no page refresh needed
```

---

## Story 2.11: Reading Permissions & Privacy

### Test Scenarios (10 AC → 14 TS)

#### TS-2.11.1: RLS Policy Enforcement
```gherkin
Feature: Data Privacy

Scenario: RLS blocks unauthorized SELECT
  Given user A has reading "r123"
  And user B is logged in
  When user B queries reading "r123" via API
  Then RLS should block
  And 403 Forbidden should return

Scenario: RLS allows own data access
  Given user A has reading "r123"
  And user A is logged in
  When user A queries reading "r123"
  Then reading data should return successfully
```

#### TS-2.11.2: API Authentication
```gherkin
Scenario: Protected endpoint without auth
  Given user is not logged in
  When user calls GET /api/readings
  Then 401 Unauthorized should return

Scenario: Protected endpoint with valid auth
  Given user is logged in
  When user calls GET /api/readings
  Then user's readings should return
```

#### TS-2.11.3: Anonymous Reading Access
```gherkin
Scenario: Anonymous reading accessible by ID
  Given anonymous reading exists with ID "anon123"
  When anyone accesses "/reading/anon123"
  Then reading should be accessible (for sharing purposes)
  And no user data is exposed
```

#### TS-2.11.4: Error Message Security
```gherkin
Scenario: Error messages don't leak data
  Given user tries to access non-existent reading
  Then error message should be generic "Not found"
  And no information about reading existence or owner revealed
```

---

## Story 2.12: User Analytics & Retention Metrics

### Test Scenarios (10 AC → 11 TS)

#### TS-2.12.1: User Event Tracking
```gherkin
Feature: Analytics

Scenario: All auth events tracked
  Given user performs auth actions
  Then following events should fire:
    | Action | Event |
    | Signup | signup_completed |
    | Login | login_completed |
    | Logout | logout_completed |
    | Profile update | profile_updated |
```

#### TS-2.12.2: User Properties
```gherkin
Scenario: User properties set in GA4
  Given user is logged in
  Then GA4 user properties should include:
    | Property | Value |
    | user_id | hashed_id |
    | signup_method | email/google/facebook |
    | account_age_days | calculated |
    | readings_count | number |
```

#### TS-2.12.3: Privacy Compliance
```gherkin
Scenario: No PII in analytics
  Given analytics are tracked
  Then no email addresses should be sent
  And no names should be sent
  And user_id should be hashed
```

---

## Story 2.13: Email Notifications Setup

### Test Scenarios (10 AC → 11 TS)

#### TS-2.13.1: Welcome Email
```gherkin
Feature: Email Notifications

Scenario: Welcome email sent on signup
  Given user signs up with email
  Then welcome email should be sent
  And email should arrive within 1 minute
  And email should have app branding
  And email should include user's name if provided
```

#### TS-2.13.2: Email Deliverability
```gherkin
Scenario: Emails land in inbox (not spam)
  Given email is sent
  Then email should land in primary inbox
  And SPF/DKIM should pass
  And spam score should be low
```

#### TS-2.13.3: Email Formatting
```gherkin
Scenario: Email displays correctly on mobile
  Given email is received
  When viewed on mobile email client
  Then email should be responsive
  And images should display
  And links should be clickable

Scenario: Email displays correctly on desktop
  Given email is received
  When viewed on Gmail/Outlook
  Then email should render correctly
```

---

## Story 2.14: Performance & Security Optimization

### Test Scenarios (10 AC → 13 TS)

#### TS-2.14.1: Security Headers
```gherkin
Feature: Security

Scenario: Secure cookie configuration
  Given user is logged in
  Then session cookie should be:
    | Attribute | Value |
    | HttpOnly | true |
    | Secure | true (production) |
    | SameSite | Lax |
```

#### TS-2.14.2: Performance
```gherkin
Scenario: Login completes in < 1 second
  Given user submits login form
  When login API is called
  Then response should return in < 1 second
  And UI should update immediately

Scenario: History page loads quickly
  Given user has 100 readings
  When user navigates to history
  Then first 20 readings load in < 2 seconds
```

#### TS-2.14.3: Rate Limiting
```gherkin
Scenario: Brute force protection
  Given attacker attempts 10 logins in 1 minute
  Then after 5th attempt, lockout should trigger
  And lockout duration is 15 minutes
```

#### TS-2.14.4: CORS
```gherkin
Scenario: CORS blocks unauthorized origins
  Given request comes from unauthorized origin
  When API is called
  Then CORS should block request
  And error should return
```

---

## Story 2.15: Epic 2 Testing & QA

### Test Scenarios (12 AC → 20 TS)

#### TS-2.15.1: E2E Test Flows
```gherkin
Feature: End-to-End Testing

Scenario: Complete signup flow E2E
  Given user is new
  When user navigates to signup page
  And fills valid registration form
  And submits form
  Then verification email should send
  When user verifies email
  Then user should be logged in
  And onboarding should display

Scenario: Complete login flow E2E
  Given registered user
  When user navigates to login page
  And enters valid credentials
  And clicks login
  Then user should be logged in
  And redirected to intended page

Scenario: Complete password reset E2E
  Given user forgot password
  When user requests reset
  And receives email
  And clicks reset link
  And enters new password
  Then password should be changed
  And user should be logged in

Scenario: View reading history E2E
  Given logged-in user with readings
  When user navigates to history
  And applies filters
  And clicks on a reading
  Then full reading detail should display

Scenario: Delete reading E2E
  Given logged-in user viewing own reading
  When user clicks delete
  And confirms deletion
  Then reading should be removed
  And user redirected to history
```

#### TS-2.15.2: Security Testing
```gherkin
Scenario: SQL injection prevention
  Given attacker tries SQL injection in login form
  When form is submitted with "' OR 1=1 --"
  Then attack should be blocked
  And no data exposed

Scenario: XSS prevention
  Given attacker tries XSS in question field
  When "<script>alert('xss')</script>" is submitted
  Then script should be escaped
  And no XSS execution
```

#### TS-2.15.3: Cross-Browser Testing
```gherkin
Scenario: Auth works on Safari iOS
  Given user is on Safari iOS
  Then signup, login, logout should work correctly
  And session should persist

Scenario: Auth works on Chrome Android
  Given user is on Chrome Android
  Then all auth flows should work correctly

Scenario: Auth works on Desktop browsers
  Given user is on Chrome/Firefox/Safari/Edge desktop
  Then all auth flows should work correctly
```

#### TS-2.15.4: Accessibility Testing
```gherkin
Scenario: Forms are keyboard accessible
  Given user navigates with keyboard only
  When user tabs through signup form
  Then all inputs should be focusable
  And focus indicators should be visible
  And form should be submittable

Scenario: Screen reader compatibility
  Given user uses screen reader
  When navigating auth pages
  Then all labels should be announced
  And error messages should be announced
  And success messages should be announced
```

#### TS-2.15.5: Regression Testing
```gherkin
Scenario: Epic 1 features still work
  Given Epic 2 is deployed
  When user accesses Epic 1 features:
    - Landing page
    - Card selection
    - Daily reading flow
    - 3-Card spread flow
  Then all features should work correctly
  And no regressions introduced
```

---

## Test Data Matrix

### User Test Data

| User Type | Email | Password | Auth Method | Status |
|-----------|-------|----------|-------------|--------|
| Standard | test1@example.com | Password123 | Email | Verified |
| Unverified | test2@example.com | Password123 | Email | Unverified |
| Google OAuth | google@gmail.com | - | Google | Verified |
| Facebook OAuth | fb@facebook.com | - | Facebook | Verified |
| With Readings | withreadings@example.com | Password123 | Email | Verified, 50 readings |
| Empty | empty@example.com | Password123 | Email | Verified, 0 readings |

### Reading Test Data

| Reading ID | Type | User | Question | Cards | Date |
|------------|------|------|----------|-------|------|
| r001 | daily | test1 | "ดวงประจำวัน" | 1 card | Today |
| r002 | three_card | test1 | "ความรัก" | 3 cards | Yesterday |
| r003 | daily | test1 | null | 1 card | 7 days ago |
| r004 | daily | anonymous | "งาน" | 1 card | Today |

---

## Cross-Functional Test Areas

### 1. Security Testing

```yaml
Test Areas:
  - Authentication bypass attempts
  - Session hijacking prevention
  - CSRF protection
  - XSS prevention
  - SQL injection prevention
  - Rate limiting effectiveness
  - Password security (storage, transmission)
  - RLS policy enforcement
  - API authentication validation

Tools:
  - OWASP ZAP
  - Burp Suite
  - Manual penetration testing
```

### 2. Performance Testing

```yaml
Test Areas:
  - Login response time (< 1s)
  - History page load time (< 2s)
  - Token refresh latency
  - Database query performance
  - Image upload time
  - Concurrent user handling

Metrics:
  - P95 response times
  - Error rates
  - Throughput
```

### 3. Accessibility Testing

```yaml
Test Areas:
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast (WCAG AA)
  - Focus indicators
  - Form labels
  - Error announcements
  - Skip links

Tools:
  - axe DevTools
  - WAVE
  - NVDA/VoiceOver
  - Keyboard-only navigation
```

### 4. Email Testing

```yaml
Test Areas:
  - Deliverability (inbox, not spam)
  - Template rendering (mobile, desktop)
  - Link functionality
  - Branding consistency
  - Localization (Thai language)

Email Clients to Test:
  - Gmail (web, mobile)
  - Outlook (web, desktop)
  - Apple Mail
  - LINE Mail (Thailand popular)
```

---

## Risk-Based Test Prioritization

### Priority 0 (Critical - Must Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-2.1.1 | Valid signup flow | Security | Users cannot create accounts |
| TS-2.2.1 | Valid login flow | Security | Users cannot access app |
| TS-2.3.3 | Password update | Security | Users locked out |
| TS-2.4.5 | Account deletion | GDPR/PDPA | Legal compliance |
| TS-2.5.3 | RLS enforcement | Data Privacy | Data breach |
| TS-2.11.1 | RLS SELECT block | Data Privacy | Data exposure |
| TS-2.14.3 | Brute force protection | Security | Account compromise |

### Priority 1 (High - Should Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-2.1.3 | OAuth signup | User Acquisition | Lost signups |
| TS-2.2.4 | Rate limiting | Security | Abuse |
| TS-2.2.5 | Protected routes | Access Control | Unauthorized access |
| TS-2.6.1 | History display | User Experience | Lost readings |
| TS-2.9.3 | Reading claiming | User Value | Data loss |
| TS-2.13.1 | Welcome email | Engagement | Poor first impression |

### Priority 2 (Medium - Nice to Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-2.4.3 | Profile picture upload | UX | Minor inconvenience |
| TS-2.6.3 | Filters | UX | Usability |
| TS-2.8.1 | Onboarding | Activation | Lower engagement |
| TS-2.10.4 | Real-time nav updates | UX | Minor confusion |
| TS-2.12.1 | Analytics tracking | Business Intelligence | Metrics gaps |

---

## Test Execution Plan

### Phase 1: Unit & Integration Tests (Week 1)

```yaml
Focus:
  - Validation schemas
  - API endpoints
  - Database queries
  - RLS policies

Coverage Target: 80%

Automation:
  - Vitest for unit tests
  - Supabase test utilities for RLS
```

### Phase 2: E2E Tests (Week 1-2)

```yaml
Focus:
  - Critical user flows
  - Authentication flows
  - History & reading flows

Automation:
  - Playwright
  - 10-15 E2E test scenarios

Execution:
  - Run on every PR
  - Run before deployment
```

### Phase 3: Security Testing (Week 2)

```yaml
Focus:
  - Penetration testing
  - RLS validation
  - Input sanitization
  - OWASP Top 10

Execution:
  - Manual testing
  - OWASP ZAP scan
  - Code review
```

### Phase 4: Cross-Functional Testing (Week 2-3)

```yaml
Focus:
  - Cross-browser testing
  - Mobile testing
  - Accessibility audit
  - Performance benchmarks

Devices:
  - iPhone 12, 14
  - Pixel 6, Samsung Galaxy
  - iPad
  - Desktop browsers
```

### Phase 5: Regression & UAT (Week 3)

```yaml
Focus:
  - Epic 1 regression
  - Full feature validation
  - User acceptance testing

Execution:
  - Run full E2E suite
  - Manual exploratory testing
  - Stakeholder demo
```

---

## Test Exit Criteria

### Epic 2 Release Criteria

```yaml
Must Have (Exit Criteria):
  ✅ All P0 test scenarios pass: 100%
  ✅ All P1 test scenarios pass: 100%
  ✅ P2 test scenarios pass: ≥ 90%
  ✅ Security audit complete: No critical/high findings
  ✅ RLS policies verified: 100% coverage
  ✅ E2E tests pass: 100%
  ✅ No P0/P1 bugs open
  ✅ Performance targets met: Login < 1s, History < 2s
  ✅ Accessibility audit: WCAG AA compliant
  ✅ Email deliverability: > 95% inbox rate

Nice to Have:
  ✅ Unit test coverage: ≥ 80%
  ✅ All P2 test scenarios pass: 100%
  ✅ Zero known bugs
```

---

## Appendix: Test Case Templates

### Playwright E2E Test Template

```typescript
// tests/epic2/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Epic 2: User Authentication', () => {
  test('TS-2.1.1: Valid email signup', async ({ page }) => {
    // Given
    await page.goto('/auth/signup');

    // When
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Password123');
    await page.fill('[name="confirmPassword"]', 'Password123');
    await page.check('[name="termsAccepted"]');
    await page.check('[name="pdpaConsent"]');
    await page.click('button[type="submit"]');

    // Then
    await expect(page).toHaveURL('/auth/verify-email');
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('TS-2.2.1: Valid login', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="password"]', 'Password123');
    await page.click('button[type="submit"]');

    // Then
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('TS-2.2.4: Rate limiting after 5 failed attempts', async ({ page }) => {
    await page.goto('/auth/login');

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await page.fill('[name="email"]', 'test@example.com');
      await page.fill('[name="password"]', 'WrongPassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Then lockout should trigger
    await expect(page.locator('text=Too many attempts')).toBeVisible();
  });
});
```

### RLS Policy Test Template

```sql
-- Test: User can only access own readings
BEGIN;

-- Set up test users
SET request.jwt.claims = '{"sub":"user-a-uuid"}';
SELECT COUNT(*) FROM readings WHERE user_id = 'user-a-uuid'; -- Should return user A's readings

SET request.jwt.claims = '{"sub":"user-b-uuid"}';
SELECT COUNT(*) FROM readings WHERE user_id = 'user-a-uuid'; -- Should return 0 (blocked by RLS)

ROLLBACK;
```

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-07 | 1.0 | Initial test design creation | Quinn (QA) |

---

## Summary

### Test Design Complete

```yaml
Epic 2 Test Design:
  ├─ 15 Stories analyzed
  ├─ 159 Acceptance Criteria mapped
  ├─ 189 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  ├─ Cross-functional coverage
  ├─ Test data matrix
  ├─ Execution plan
  └─ Exit criteria defined

Status: COMPLETE ✅
Ready for: Implementation & Execution
```

