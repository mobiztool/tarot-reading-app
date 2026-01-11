# Epic 3: Social Sharing & Content Discovery - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 3: Social Sharing & Content Discovery |
| **Stories** | 3.1-3.13 (13 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 3 Overview
Epic 3 เพิ่มความสามารถในการแชร์ผลดูดวงไปยัง social media และสร้าง Tarot Encyclopedia สำหรับ SEO และ content marketing

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 13 |
| Total Acceptance Criteria | 143 |
| Total Test Scenarios | 165 |
| High-Risk Scenarios | 28 |
| Medium-Risk Scenarios | 72 |
| Low-Risk Scenarios | 65 |

### Risk Assessment Summary

```yaml
HIGH RISK (P0):
  - Image generation quality (3.1)
  - Social sharing functionality (3.2)
  - Content accuracy (3.12)
  - All 78 cards accessible (3.4, 3.5)

MEDIUM RISK (P1):
  - SEO implementation (3.3, 3.7, 3.9)
  - Search/filter accuracy (3.6)
  - Blog content quality (3.8)
  - Analytics tracking (3.10)

LOW RISK (P2):
  - Gamification features (3.11)
  - A/B testing infrastructure (3.9)
  - Weekly reports (3.10)
  - Print CSS (3.5)
```

---

## Story 3.1: Social Share Image Generation

### Test Scenarios (12 AC → 16 TS)

#### TS-3.1.1: Image Generation
```gherkin
Feature: Share Image Generation

Scenario: Generate Daily Reading share image
  Given user completed a Daily Reading with "The Fool" card
  When user clicks "Share" button
  Then share image should generate successfully
  And image should be 1080×1080px (Instagram format)
  And image should contain:
    | Element | Present |
    | Card image | Yes |
    | Card name | Yes |
    | Brief meaning | Yes |
    | App watermark | Yes |
    | Mystical background | Yes |

Scenario: Generate 3-Card Spread share image
  Given user completed 3-Card Spread
  When user clicks "Share" button
  Then share image should generate successfully
  And image should show 3 cards horizontally
  And position labels should display: "อดีต", "ปัจจุบัน", "อนาคต"

Scenario: Generate Facebook/Twitter format
  Given user wants to share to Facebook or Twitter
  When image is generated
  Then image should be 1200×630px
  And aspect ratio should be correct for social preview
```

#### TS-3.1.2: Image Quality & Performance
```gherkin
Scenario: Image file size within limit
  Given share image is generated
  Then file size should be < 500KB
  And image quality should be high-resolution
  And colors should match branding (purple, gold)

Scenario: Image generation performance
  Given user requests share image
  When image generator processes request
  Then image should generate in < 2 seconds
  And progress indicator should display during generation

Scenario: Mobile image generation
  Given user is on mobile device
  When user requests share image
  Then image should generate successfully
  And device should not freeze or lag
```

#### TS-3.1.3: Privacy Protection
```gherkin
Scenario: Question text excluded from image
  Given user entered question "จะได้งานใหม่ไหม"
  When share image is generated
  Then question text should NOT appear in image
  And no personal details should be visible

Scenario: No user identifiable information
  Given logged-in user shares reading
  When share image is generated
  Then no user name should appear
  And no email should appear
  And no profile picture should appear
```

#### TS-3.1.4: Preview Feature
```gherkin
Scenario: Preview before sharing
  Given share image is generated
  Then preview should display to user
  And "Share" and "Cancel" buttons available
  And user can regenerate if needed
```

### Test Data Requirements
```yaml
Daily Reading Test Data:
  - The Fool (upright)
  - Death (reversed) - test special characters
  - 10 of Cups - test long name

3-Card Spread Test Data:
  - Past: The Magician
  - Present: High Priestess
  - Future: The Empress
```

---

## Story 3.2: Social Media Share Buttons

### Test Scenarios (12 AC → 14 TS)

#### TS-3.2.1: Share Button Display
```gherkin
Feature: Social Share Buttons

Scenario: Share buttons visible after reading
  Given user completed a reading
  When reading result displays
  Then share buttons should be visible:
    | Platform | Icon |
    | Instagram | Instagram icon |
    | Facebook | Facebook icon |
    | Twitter/X | X icon |
    | Copy Link | Link icon |
  And buttons should have platform colors
```

#### TS-3.2.2: Instagram Share
```gherkin
Scenario: Instagram share downloads image
  Given user clicks Instagram share button
  When share action executes
  Then image should download to device
  And instructions should display: "Open Instagram to share"
  And analytics event "share_initiated" should fire with platform: "instagram"
```

#### TS-3.2.3: Facebook Share
```gherkin
Scenario: Facebook share opens dialog
  Given user clicks Facebook share button
  When share action executes
  Then Facebook share dialog should open
  And pre-generated image should be attached
  And default share text should display
  And user can customize text before posting

Scenario: Facebook share success
  Given user is in Facebook share dialog
  When user posts to Facebook
  Then analytics event "share_completed" should fire
  And success message should display
```

#### TS-3.2.4: Twitter Share
```gherkin
Scenario: Twitter share opens compose
  Given user clicks Twitter share button
  When share action executes
  Then Twitter compose window should open
  And default tweet text should include card name
  And image should be attached
```

#### TS-3.2.5: Copy Link
```gherkin
Scenario: Copy link to clipboard
  Given user clicks Copy Link button
  When action executes
  Then reading URL should copy to clipboard
  And success toast "Link copied!" should display
  And URL should be shareable (public or with token)
```

#### TS-3.2.6: Web Share API
```gherkin
Scenario: Native share on mobile (Web Share API)
  Given user is on mobile device with Web Share API support
  When user clicks share button
  Then native share sheet should appear
  And user can share to any installed app
  And image and text should be included

Scenario: Fallback for unsupported browsers
  Given user is on browser without Web Share API
  When user clicks share button
  Then custom share buttons should display
  And manual sharing instructions available
```

#### TS-3.2.7: Analytics
```gherkin
Scenario: Share analytics tracked
  Given user initiates share
  Then event "share_initiated" should fire with:
    | Property | Value |
    | platform | selected platform |
    | reading_type | daily/three_card |
  When share completes
  Then event "share_completed" should fire
  When user cancels share
  Then event "share_cancelled" should fire
```

---

## Story 3.3: Open Graph & Social Media Meta Tags

### Test Scenarios (11 AC → 13 TS)

#### TS-3.3.1: OG Tags on Pages
```gherkin
Feature: Open Graph Meta Tags

Scenario: Homepage has OG tags
  Given user views homepage
  Then page should have OG tags:
    | Tag | Present |
    | og:title | Yes |
    | og:description | Yes |
    | og:image | Yes (1200×630px) |
    | og:url | Yes |
    | og:type | website |

Scenario: Reading result page has dynamic OG
  Given reading result page for Daily Reading
  Then og:title should include card name
  And og:image should show card image
  And og:description should have card meaning preview

Scenario: Card encyclopedia page has unique OG
  Given card page for "The Fool"
  Then og:title should be "The Fool - Tarot Card Meaning"
  And og:image should show The Fool card
```

#### TS-3.3.2: Twitter Card Tags
```gherkin
Scenario: Twitter Card tags present
  Given any public page
  Then page should have Twitter tags:
    | Tag | Present |
    | twitter:card | summary_large_image |
    | twitter:title | Yes |
    | twitter:description | Yes |
    | twitter:image | Yes |
```

#### TS-3.3.3: Validation
```gherkin
Scenario: Facebook Sharing Debugger validation
  Given any page URL
  When URL is tested in Facebook Sharing Debugger
  Then validation should pass
  And preview should display correctly
  And no errors or warnings

Scenario: Twitter Card Validator
  Given any page URL
  When URL is tested in Twitter Card Validator
  Then card should render correctly
  And image should display
```

#### TS-3.3.4: Fallback Image
```gherkin
Scenario: Default OG image when specific not available
  Given page without specific OG image
  When OG tags are rendered
  Then default branded OG image should be used
  And fallback should look professional
```

---

## Story 3.4: Tarot Encyclopedia - Card Database Page

### Test Scenarios (14 AC → 18 TS)

#### TS-3.4.1: Encyclopedia Main Page
```gherkin
Feature: Tarot Encyclopedia

Scenario: View encyclopedia with all 78 cards
  Given user navigates to "/cards"
  Then all 78 cards should display
  And cards should be organized in grid layout
  And each card shows: image, Thai name, English name

Scenario: Cards organized by suit
  Given user is on encyclopedia page
  Then cards should be grouped by:
    | Suit | Count |
    | Major Arcana | 22 |
    | Wands | 14 |
    | Cups | 14 |
    | Swords | 14 |
    | Pentacles | 14 |
  And Major Arcana should have special styling
```

#### TS-3.4.2: Responsive Grid
```gherkin
Scenario: Grid layout on desktop
  Given user is on desktop (1024px+)
  When viewing encyclopedia
  Then 3-4 cards should display per row
  And spacing should be appropriate

Scenario: Grid layout on mobile
  Given user is on mobile (< 768px)
  When viewing encyclopedia
  Then 2 cards should display per row
  And touch targets should be adequate
```

#### TS-3.4.3: Tab Navigation
```gherkin
Scenario: Switch between suits via tabs
  Given user is on encyclopedia page
  When user clicks "Cups" tab
  Then only Cups cards should display (14 cards)
  And "Cups" tab should be highlighted

Scenario: "All" tab shows all cards
  Given user clicked specific suit tab
  When user clicks "All" tab
  Then all 78 cards should display
```

#### TS-3.4.4: Lazy Loading
```gherkin
Scenario: Images load progressively
  Given user loads encyclopedia page
  Then only visible card images should load
  And skeleton placeholders show for unloaded images
  When user scrolls down
  Then more images should load on demand
```

#### TS-3.4.5: Card Navigation
```gherkin
Scenario: Click card to view details
  Given user is on encyclopedia page
  When user clicks on "The Fool" card
  Then user should navigate to "/cards/the-fool"
  And card detail page should display
```

#### TS-3.4.6: SEO & Breadcrumbs
```gherkin
Scenario: SEO meta tags
  Given user views encyclopedia page
  Then page title should be "Tarot Card Encyclopedia | 78 Cards"
  And meta description should be SEO-optimized

Scenario: Breadcrumbs display
  Given user is on encyclopedia page
  Then breadcrumbs should show: Home > Encyclopedia
  And breadcrumbs should be clickable
```

---

## Story 3.5: Tarot Encyclopedia - Individual Card Pages

### Test Scenarios (12 AC → 16 TS)

#### TS-3.5.1: Card Detail Page
```gherkin
Feature: Individual Card Pages

Scenario: View card detail for The Fool
  Given user navigates to "/cards/the-fool"
  Then page should display:
    | Element | Content |
    | Image | Large Fool card image |
    | Name | The Fool / เดอะ ฟูล |
    | Number | 0 - Major Arcana |
    | Upright | 3-4 paragraphs |
    | Reversed | 3-4 paragraphs |
    | Keywords | upright and reversed |
    | Symbolism | visual elements explained |
    | Advice | practical guidance |

Scenario: All 78 card pages exist
  Given all cards in database
  When testing each card URL
  Then all 78 pages should be accessible
  And no 404 errors
```

#### TS-3.5.2: SEO-Friendly URLs
```gherkin
Scenario: URL slugs are SEO-friendly
  Given card pages exist
  Then URLs should follow pattern:
    | Card | URL |
    | The Fool | /cards/the-fool |
    | Ace of Cups | /cards/ace-of-cups |
    | Knight of Swords | /cards/knight-of-swords |
    | 10 of Pentacles | /cards/10-of-pentacles |
```

#### TS-3.5.3: Related Cards
```gherkin
Scenario: Related cards section displays
  Given user is on "The Magician" card page
  Then "Related Cards" section should display
  And 3-4 related cards shown (similar energy/suit)
  And clicking related card navigates to that page
```

#### TS-3.5.4: Navigation
```gherkin
Scenario: Previous/Next card navigation
  Given user is on "The Magician" card page
  Then "Previous" should link to "The Fool"
  And "Next" should link to "The High Priestess"
  And navigation should work for all 78 cards

Scenario: Breadcrumbs on card page
  Given user is on "The Fool" card page
  Then breadcrumbs: Home > Encyclopedia > The Fool
  And clicking "Encyclopedia" returns to /cards
```

#### TS-3.5.5: CTA & Internal Linking
```gherkin
Scenario: CTA to start reading
  Given user is on any card page
  Then CTA button "Get your reading" should display
  And clicking navigates to /reading
```

#### TS-3.5.6: SEO Optimization
```gherkin
Scenario: Individual card SEO
  Given user is on "The Fool" card page
  Then page title should include "The Fool Tarot Card Meaning"
  And H1 should be card name
  And H2s should structure content sections
  And JSON-LD Article schema should be present
```

---

## Story 3.6: Encyclopedia Search & Filter Enhancement

### Test Scenarios (13 AC → 15 TS)

#### TS-3.6.1: Real-time Search
```gherkin
Feature: Encyclopedia Search

Scenario: Search by card name
  Given user is on encyclopedia page
  When user types "Fool" in search box
  Then only cards matching "Fool" should display
  And results update as user types (debounced 500ms)

Scenario: Search by Thai name
  Given user types "เดอะ ฟูล"
  Then "The Fool" card should display
  And search works for Thai characters

Scenario: Search by keyword
  Given user types "love"
  Then cards with "love" in keywords should display
  And matching text should be highlighted
```

#### TS-3.6.2: Filter by Suit
```gherkin
Scenario: Filter by Major Arcana
  Given user clicks "Major Arcana" filter
  Then only 22 Major Arcana cards display
  And filter is visually selected

Scenario: Filter by element (Minor Arcana)
  Given user clicks "Fire (Wands)" filter
  Then only 14 Wands cards display
```

#### TS-3.6.3: Filter by Card Type
```gherkin
Scenario: Filter Court Cards
  Given user clicks "Court Cards" filter
  Then only Pages, Knights, Queens, Kings display (16 cards)

Scenario: Multiple filters combined
  Given user selects "Cups" AND "Court Cards"
  Then only Page, Knight, Queen, King of Cups display (4 cards)
```

#### TS-3.6.4: URL Persistence
```gherkin
Scenario: Filters persist in URL
  Given user applies filters: suit=cups, search=love
  Then URL should update to "?suit=cups&q=love"
  And refreshing page should maintain filters
  And URL is shareable

Scenario: Clear filters button
  Given user has active filters
  When user clicks "Clear filters"
  Then all filters should reset
  And all 78 cards should display
  And URL should clear query params
```

#### TS-3.6.5: Results Count
```gherkin
Scenario: Results count displays
  Given user applies filter
  Then results count should display: "Showing X of 78 cards"

Scenario: Empty state
  Given user searches for "nonexistent"
  Then empty state should display
  And message: "No cards found"
  And suggestion: "Try clearing filters"
```

#### TS-3.6.6: Mobile Filters
```gherkin
Scenario: Mobile filter panel
  Given user is on mobile device
  When user taps filter icon
  Then filter panel should appear (bottom sheet or modal)
  And filters should be touch-friendly
  And "Apply" button closes panel
```

---

## Story 3.7: SEO Content Strategy Implementation

### Test Scenarios (12 AC → 14 TS)

#### TS-3.7.1: Structured Data
```gherkin
Feature: SEO Implementation

Scenario: Article schema on card pages
  Given any card detail page
  When page source is inspected
  Then JSON-LD Article schema should be present
  And schema should include: headline, author, datePublished

Scenario: BreadcrumbList schema
  Given any page with breadcrumbs
  Then JSON-LD BreadcrumbList schema should be present
  And schema should match visible breadcrumbs

Scenario: WebSite schema on homepage
  Given homepage
  Then JSON-LD WebSite schema should be present
  And potentialAction for SearchAction included
```

#### TS-3.7.2: Technical SEO
```gherkin
Scenario: XML Sitemap
  Given /sitemap.xml URL
  Then sitemap should be accessible
  And sitemap should include all 78 card pages
  And sitemap should include blog posts
  And sitemap should be valid XML

Scenario: Robots.txt
  Given /robots.txt URL
  Then robots.txt should be accessible
  And should allow crawling of /cards/*
  And should allow crawling of /blog/*
  And should reference sitemap.xml

Scenario: Canonical URLs
  Given any page
  Then canonical link tag should be present
  And canonical should point to correct URL
  And no duplicate content issues
```

#### TS-3.7.3: Lighthouse SEO
```gherkin
Scenario: Lighthouse SEO score
  Given any major page (home, cards, blog)
  When Lighthouse audit runs
  Then SEO score should be ≥ 95
  And no critical SEO issues

Scenario: Mobile-friendly test
  Given any page
  When Google Mobile-Friendly Test runs
  Then page should pass
  And no mobile usability issues
```

#### TS-3.7.4: Google Search Console
```gherkin
Scenario: Search Console configured
  Given Search Console access
  Then site should be verified
  And sitemap should be submitted
  And coverage reports should be available
```

---

## Story 3.8: Content Marketing Blog Foundation

### Test Scenarios (12 AC → 13 TS)

#### TS-3.8.1: Blog Main Page
```gherkin
Feature: Blog

Scenario: View blog listing page
  Given user navigates to "/blog"
  Then list of blog posts should display
  And each post shows: title, date, author, excerpt, featured image
  And posts are ordered by date (newest first)

Scenario: Empty blog state
  Given no blog posts exist
  Then "Coming soon" message should display
```

#### TS-3.8.2: Blog Post Page
```gherkin
Scenario: View individual blog post
  Given user clicks on blog post
  Then post page should display with:
    | Element | Present |
    | Title | Yes |
    | Author | Yes |
    | Date | Yes |
    | Featured image | Yes |
    | Content | Yes |
    | Category tags | Yes |
    | Related posts | Yes |
    | Share buttons | Yes |

Scenario: CTA in blog posts
  Given user is reading blog post
  Then CTA "Try your reading now" should be visible
  And clicking navigates to /reading
```

#### TS-3.8.3: Categories & Tags
```gherkin
Scenario: Filter by category
  Given blog has category "Beginners"
  When user clicks "Beginners" tag
  Then only posts in Beginners category display
```

#### TS-3.8.4: SEO & RSS
```gherkin
Scenario: Blog post SEO
  Given any blog post
  Then unique meta title and description present
  And Article schema present

Scenario: RSS feed
  Given /blog/feed.xml URL
  Then valid RSS feed should return
  And feed should include recent posts
```

---

## Story 3.9: Landing Page SEO & Conversion Optimization

### Test Scenarios (12 AC → 14 TS)

#### TS-3.9.1: Hero Section
```gherkin
Feature: Landing Page Optimization

Scenario: Hero section optimized
  Given user lands on homepage
  Then hero should have clear value proposition
  And H1 should include target keywords
  And primary CTA "เริ่มดูดวงฟรี" should be above the fold
  And CTA should be prominent and clickable
```

#### TS-3.9.2: Conversion Elements
```gherkin
Scenario: Social proof section
  Given user views homepage
  Then social proof should display ("X users trusted")
  Or testimonials should display

Scenario: Feature highlights
  Given user scrolls homepage
  Then 3-4 key features should display
  And each feature has icon, title, description

Scenario: How it works section
  Given user scrolls homepage
  Then 3-step guide should display
  And steps: Select → Draw → Discover
  And visual illustrations present

Scenario: FAQ section
  Given user scrolls to FAQ
  Then 5-7 FAQ items should display
  And clicking expands/collapses answer
  And FAQ schema should be present
```

#### TS-3.9.3: Trust Signals
```gherkin
Scenario: Trust signals visible
  Given user views homepage
  Then trust signals should display:
    | Signal | Present |
    | Privacy badge | Yes |
    | PDPA compliance | Yes |
    | Secure icon | Yes |
```

#### TS-3.9.4: Analytics
```gherkin
Scenario: Conversion tracking
  Given user interacts with homepage
  Then analytics should track:
    | Event | Trigger |
    | cta_click | CTA button click |
    | scroll_depth | 25%, 50%, 75%, 100% |
    | time_on_page | Every 30 seconds |
```

---

## Story 3.10: Analytics & Growth Metrics Dashboard

### Test Scenarios (12 AC → 12 TS)

#### TS-3.10.1: Share Analytics
```gherkin
Feature: Growth Analytics

Scenario: Share events tracked
  Given user shares reading
  Then following events should fire:
    | Event | Properties |
    | share_initiated | platform, reading_type |
    | share_completed | platform, success |
  And events visible in GA4

Scenario: Virality metric calculated
  Given share data collected
  Then virality coefficient should be calculable
  And metric available in dashboard
```

#### TS-3.10.2: Content Analytics
```gherkin
Scenario: Encyclopedia page views tracked
  Given user views card page
  Then page view should track with:
    | Property | Value |
    | page_path | /cards/the-fool |
    | card_name | The Fool |

Scenario: Most viewed cards report
  Given analytics collected
  Then "Most viewed cards" report should be available
  And shows top 10 cards by views
```

#### TS-3.10.3: Conversion Funnel
```gherkin
Scenario: Content to reading funnel
  Given user journey: blog → reading → signup
  Then funnel should track:
    | Step | Event |
    | Entry | page_view (blog) |
    | Conversion 1 | reading_started |
    | Conversion 2 | signup_completed |
  And conversion rates visible
```

#### TS-3.10.4: UTM Tracking
```gherkin
Scenario: UTM parameters tracked
  Given user visits with URL containing UTM params
  Then source, medium, campaign should be tracked
  And attributable to conversion events
```

---

## Story 3.11: Share Incentives & Gamification

### Test Scenarios (10 AC → 11 TS)

#### TS-3.11.1: Share Prompt
```gherkin
Feature: Share Incentives

Scenario: Share prompt after reading
  Given user completes reading
  Then share prompt should display: "Love your reading? Share it!"
  And prompt should be dismissible
  And prompt should not be pushy
```

#### TS-3.11.2: Badges
```gherkin
Scenario: Sharer badge unlocked
  Given user shares for first time
  When share completes successfully
  Then "Sharer" badge should unlock
  And badge should appear in profile
  And notification: "You earned the Sharer badge!"

Scenario: Badge persists
  Given user earned Sharer badge
  When user views profile
  Then badge should display
```

#### TS-3.11.3: Social Proof
```gherkin
Scenario: Daily share count displayed
  Given users have shared today
  Then "X people shared today" should display
  And count updates in near-real-time
```

#### TS-3.11.4: Sharing Stats
```gherkin
Scenario: User sharing stats in profile
  Given logged-in user has shared 5 times
  When user views profile
  Then "You've shared 5 readings" should display
```

#### TS-3.11.5: Privacy & UX
```gherkin
Scenario: Never auto-post
  Given user clicks share button
  Then share should NOT post automatically
  And user must confirm before posting

Scenario: Prompt is dismissible
  Given share prompt displays
  When user clicks dismiss
  Then prompt should close
  And not show again for some time
```

---

## Story 3.12: Encyclopedia Content Quality Assurance

### Test Scenarios (12 AC → 14 TS)

#### TS-3.12.1: Expert Review
```gherkin
Feature: Content Quality

Scenario: All 78 cards reviewed by expert
  Given tarot expert assigned
  Then all 78 cards should have:
    | Criteria | Status |
    | Expert reviewed | Yes |
    | Accuracy verified | Yes |
    | Completeness checked | Yes |
```

#### TS-3.12.2: Content Quality
```gherkin
Scenario: Thai language quality
  Given any card content
  Then content should be:
    - Grammatically correct
    - Natural Thai (not literal translation)
    - Appropriate for target audience
    - No typos or spelling errors

Scenario: Style guide followed
  Given all card content
  Then consistent style across cards:
    - Same tone of voice
    - Similar length per section
    - Consistent formatting
```

#### TS-3.12.3: Accuracy
```gherkin
Scenario: Traditional interpretation accuracy
  Given card meanings
  Then meanings should align with Rider-Waite tradition
  And no contradictions between cards
  And internal consistency maintained
```

#### TS-3.12.4: Completeness
```gherkin
Scenario: All sections filled
  Given any card
  Then following sections should have content:
    | Section | Min Length |
    | Upright meaning | 200 words |
    | Reversed meaning | 200 words |
    | Keywords upright | 5 items |
    | Keywords reversed | 5 items |
    | Symbolism | 100 words |
    | Advice | 100 words |
```

#### TS-3.12.5: Originality
```gherkin
Scenario: No plagiarism
  Given all card content
  When checked with plagiarism detection tool
  Then originality score should be > 90%
  And no copied content from other sources
```

#### TS-3.12.6: User Testing
```gherkin
Scenario: User feedback collected
  Given 5-10 users read sample cards
  Then feedback should be collected
  And average clarity rating ≥ 4/5
  And revisions made based on feedback
```

---

## Story 3.13: Epic 3 Testing & Quality Assurance

### Test Scenarios (14 AC → 19 TS)

#### TS-3.13.1: Social Sharing E2E
```gherkin
Feature: Epic 3 E2E Testing

Scenario: Complete share flow on iOS
  Given user on iPhone with reading
  When user shares to Instagram
  Then image should download
  And instructions should display
  And no errors occur

Scenario: Complete share flow on Android
  Given user on Android with reading
  When user uses Web Share API
  Then native share sheet should appear
  And sharing should work
```

#### TS-3.13.2: Encyclopedia E2E
```gherkin
Scenario: Browse all 78 cards
  Given user on encyclopedia page
  When user clicks through all cards
  Then all 78 pages should load successfully
  And no broken links

Scenario: Search and filter flow
  Given user searches for "love"
  And applies "Major Arcana" filter
  Then filtered results should display
  And results should be accurate
```

#### TS-3.13.3: SEO Validation
```gherkin
Scenario: Rich Results validation
  Given all card pages
  When tested with Google Rich Results Test
  Then all pages should pass
  And structured data valid
```

#### TS-3.13.4: Performance Testing
```gherkin
Scenario: Encyclopedia loads quickly
  Given encyclopedia page
  When page loads
  Then load time should be < 2 seconds
  And images lazy load properly

Scenario: Image generation performance
  Given share image request
  When image generates
  Then generation should complete in < 2 seconds
```

#### TS-3.13.5: Cross-Browser Testing
```gherkin
Scenario: Safari iOS compatibility
  Given Safari on iOS
  Then all Epic 3 features should work:
    - Share buttons functional
    - Encyclopedia accessible
    - Blog readable
    - All animations smooth

Scenario: Chrome Android compatibility
  Given Chrome on Android
  Then all features should work correctly

Scenario: Desktop browsers
  Given Chrome/Firefox/Safari/Edge on desktop
  Then all features should work correctly
```

#### TS-3.13.6: Accessibility
```gherkin
Scenario: Encyclopedia keyboard navigation
  Given user navigates with keyboard only
  Then all cards should be focusable
  And filter buttons accessible
  And search input reachable

Scenario: Screen reader on card pages
  Given screen reader active
  When reading card page
  Then card name should be announced
  And sections properly structured
  And images have alt text
```

#### TS-3.13.7: Content QA
```gherkin
Scenario: Proofreading complete
  Given all content
  Then no spelling errors
  And no grammar issues
  And consistent terminology

Scenario: No broken links
  Given all pages
  When link checker runs
  Then no 404 errors
  And all internal links work
  And all external links valid
```

---

## Test Data Matrix

### Cards Test Data

| Card | Slug | Suit | Type |
|------|------|------|------|
| The Fool | the-fool | Major | Major Arcana |
| Ace of Cups | ace-of-cups | Cups | Ace |
| Queen of Swords | queen-of-swords | Swords | Court |
| 10 of Pentacles | 10-of-pentacles | Pentacles | Numbered |

### Share Test Data

| Reading Type | Cards | Question |
|--------------|-------|----------|
| Daily | The Fool | null |
| Daily | Death (reversed) | "ความรัก" |
| Three Card | Magician, HP, Empress | "อาชีพ" |

### Blog Test Data

| Post | Slug | Category |
|------|------|----------|
| Getting Started | getting-started | Beginners |
| Major Arcana Guide | major-arcana-guide | Advanced |

---

## Cross-Functional Test Areas

### 1. Image Quality Testing

```yaml
Test Areas:
  - Image dimensions (1080×1080, 1200×630)
  - File size (< 500KB)
  - Visual quality (not pixelated)
  - Color accuracy (branding colors)
  - Text readability
  - Card image clarity

Tools:
  - Visual regression testing
  - Manual inspection
  - Automated size checks
```

### 2. SEO Testing

```yaml
Test Areas:
  - Meta tags (title, description)
  - OG tags (all required)
  - Twitter Cards
  - Structured data (JSON-LD)
  - Sitemap validity
  - Robots.txt configuration
  - Page speed (Core Web Vitals)
  - Mobile-friendliness

Tools:
  - Google Search Console
  - Lighthouse
  - Facebook Sharing Debugger
  - Twitter Card Validator
  - Google Rich Results Test
```

### 3. Social Platform Testing

```yaml
Test Areas:
  - Instagram: Image download works
  - Facebook: Share dialog opens, image attaches
  - Twitter: Tweet compose opens, image attaches
  - Copy Link: Clipboard works, URL valid
  - Web Share API: Native share sheet appears

Platforms to Test:
  - iOS Safari
  - iOS Facebook app
  - iOS Instagram app
  - Android Chrome
  - Desktop browsers
```

### 4. Content Testing

```yaml
Test Areas:
  - All 78 cards have content
  - Content accuracy (expert verified)
  - Thai language quality
  - Spelling and grammar
  - Consistency across cards
  - Originality (no plagiarism)
  - Readability

Tools:
  - Grammarly (Thai)
  - Plagiarism checker
  - Expert review checklist
  - User testing feedback
```

---

## Risk-Based Test Prioritization

### Priority 0 (Critical - Must Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-3.1.1 | Image generation works | Share broken | Users can't share |
| TS-3.2.2-5 | All share buttons work | Share broken | Feature unusable |
| TS-3.4.1 | All 78 cards display | Content missing | SEO, user trust |
| TS-3.5.1 | Card detail pages work | Content missing | SEO impact |
| TS-3.12.1 | Content expert reviewed | Accuracy | User trust |

### Priority 1 (High - Should Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-3.1.2 | Image quality < 500KB | Performance | Slow sharing |
| TS-3.3.1 | OG tags present | Social previews | Poor engagement |
| TS-3.6.1 | Search works accurately | Usability | User frustration |
| TS-3.7.2 | Sitemap valid | SEO | Lower rankings |
| TS-3.9.1 | Hero optimized | Conversion | Lower signups |

### Priority 2 (Medium - Nice to Pass)

| ID | Test Scenario | Risk | Impact |
|----|--------------|------|--------|
| TS-3.5.3 | Related cards display | UX | Minor |
| TS-3.8.1 | Blog listing works | Content marketing | Lower traffic |
| TS-3.11.2 | Badges work | Gamification | Lower engagement |
| TS-3.10.1 | Share analytics tracked | Metrics | Business intel |

---

## Test Execution Plan

### Phase 1: Core Features (Week 1)

```yaml
Focus:
  - Image generation (3.1)
  - Share buttons (3.2)
  - Encyclopedia main page (3.4)
  - Card detail pages (3.5)

Priority: P0 scenarios
Automation: Image size validation, link checking
```

### Phase 2: SEO & Content (Week 1-2)

```yaml
Focus:
  - OG tags (3.3)
  - SEO implementation (3.7)
  - Content quality (3.12)
  - Sitemap, robots.txt

Priority: P1 scenarios
Validation: SEO tools, expert review
```

### Phase 3: Advanced Features (Week 2)

```yaml
Focus:
  - Search/filter (3.6)
  - Blog (3.8)
  - Landing page optimization (3.9)
  - Analytics (3.10)
  - Gamification (3.11)

Priority: P1-P2 scenarios
```

### Phase 4: Cross-Functional & Regression (Week 3)

```yaml
Focus:
  - Cross-browser testing
  - Mobile testing on actual devices
  - Social platform testing
  - Performance testing
  - Accessibility audit
  - Epic 1-2 regression

Priority: All remaining scenarios
```

---

## Test Exit Criteria

### Epic 3 Release Criteria

```yaml
Must Have (Exit Criteria):
  ✅ All P0 test scenarios pass: 100%
  ✅ All P1 test scenarios pass: 100%
  ✅ P2 test scenarios pass: ≥ 90%
  ✅ All 78 card pages accessible: 100%
  ✅ All 78 cards expert reviewed: 100%
  ✅ Share buttons work: All platforms
  ✅ SEO validation: Lighthouse ≥ 95
  ✅ OG tags validated: Facebook, Twitter
  ✅ Sitemap submitted: Google Search Console
  ✅ No P0/P1 bugs open
  ✅ Performance: Load times < 2s
  ✅ Image generation: < 2s, < 500KB

Nice to Have:
  ✅ All P2 scenarios pass: 100%
  ✅ Blog has 3+ posts
  ✅ Gamification badges work
  ✅ Zero known bugs
```

---

## Appendix: Test Templates

### Playwright E2E Test Template

```typescript
// tests/epic3/encyclopedia.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Epic 3: Tarot Encyclopedia', () => {
  test('TS-3.4.1: All 78 cards display on encyclopedia page', async ({ page }) => {
    // Given
    await page.goto('/cards');

    // Then
    const cards = await page.locator('[data-testid="card-thumbnail"]').count();
    expect(cards).toBe(78);
  });

  test('TS-3.5.1: Card detail page displays correctly', async ({ page }) => {
    // Given
    await page.goto('/cards/the-fool');

    // Then
    await expect(page.locator('h1')).toContainText('The Fool');
    await expect(page.locator('[data-testid="upright-meaning"]')).toBeVisible();
    await expect(page.locator('[data-testid="reversed-meaning"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-image"]')).toBeVisible();
  });

  test('TS-3.6.1: Search filters cards correctly', async ({ page }) => {
    await page.goto('/cards');
    
    // When
    await page.fill('[data-testid="search-input"]', 'Fool');
    await page.waitForTimeout(600); // Debounce

    // Then
    const cards = await page.locator('[data-testid="card-thumbnail"]').count();
    expect(cards).toBe(1);
    await expect(page.locator('[data-testid="card-thumbnail"]')).toContainText('Fool');
  });
});
```

### Image Quality Test Template

```typescript
// tests/epic3/share-image.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Epic 3: Share Image Generation', () => {
  test('TS-3.1.1: Daily reading image generates correctly', async ({ page, request }) => {
    // Given - complete a reading first
    await page.goto('/reading/daily');
    // ... complete reading flow
    
    // When - generate share image
    const response = await request.get('/api/share/generate?readingId=xxx&format=instagram');
    
    // Then
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('image/');
    
    // Check file size < 500KB
    const buffer = await response.body();
    expect(buffer.length).toBeLessThan(500 * 1024);
  });
});
```

### SEO Validation Test Template

```typescript
// tests/epic3/seo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Epic 3: SEO Validation', () => {
  test('TS-3.3.1: Homepage has OG tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(ogUrl).toBeTruthy();
  });

  test('TS-3.7.2: Sitemap is valid', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    
    const xml = await response.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('/cards/the-fool');
  });
});
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
Epic 3 Test Design:
  ├─ 13 Stories analyzed
  ├─ 143 Acceptance Criteria mapped
  ├─ 165 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  ├─ Cross-functional coverage:
  │   ├─ Image Quality Testing
  │   ├─ SEO Testing
  │   ├─ Social Platform Testing
  │   └─ Content Testing
  ├─ Test data matrix
  ├─ Execution plan (3 weeks)
  └─ Exit criteria defined

Status: COMPLETE ✅
Ready for: Implementation & Execution
```

