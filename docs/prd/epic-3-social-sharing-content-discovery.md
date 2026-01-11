# Epic 3: Social Sharing & Content Discovery

**Epic Goal:**

เพิ่มความสามารถในการแชร์ผลการดูดวงไปยัง social media platforms (Instagram, Facebook, Twitter) ในรูปแบบที่สวยงามและน่าสนใจ พร้อมสร้าง Tarot Encyclopedia ที่เป็น SEO-friendly content hub สำหรับ organic growth ระยะยาว

Epic นี้เน้นการสร้าง growth engine ผ่าน 2 channels หลัก: (1) Viral social sharing ที่ทำให้ users กลายเป็น brand ambassadors และ (2) SEO content ที่ดึง organic traffic จาก search engines เข้ามาสู่ app

---

## Story 3.1: Social Share Image Generation

**As a** user who just completed a reading,  
**I want** to share my reading result as a beautiful image on social media,  
**so that** I can share my insights with friends and showcase the app.

### Acceptance Criteria

1. Share image generator function created using HTML Canvas API or server-side image generation
2. Image template designed: mystical background, card image(s), short interpretation text, app branding/logo
3. Daily Reading share image: shows 1 card, card name, brief meaning, subtle app watermark
4. 3-Card Spread share image: shows 3 cards horizontally, position labels (Past-Present-Future)
5. Image dimensions: 1080×1080px (Instagram square), 1200×630px (Facebook/Twitter) - generate both
6. Privacy protection: automatically exclude user's question text or personal details from share image
7. Image quality: high-res, properly compressed (< 500KB per image)
8. Color scheme: consistent with app branding (purple, gold, mystical aesthetic)
9. Typography: readable fonts, proper contrast for social media viewing
10. Image generation performance: creates image in < 2 seconds
11. Mobile optimization: works smoothly on mobile devices
12. Preview before sharing: show generated image before user confirms share

---

## Story 3.2: Social Media Share Buttons & Integration

**As a** user,  
**I want** easy-to-use share buttons after my reading,  
**so that** I can quickly post to my preferred social platform.

### Acceptance Criteria

1. Share buttons added to reading result page: Instagram, Facebook, Twitter, Copy Link
2. Instagram share: downloads image to device (Instagram doesn't support web sharing API)
3. Facebook share: opens Facebook share dialog with pre-generated image and text
4. Twitter share: opens Twitter compose with image and customizable tweet text
5. Copy Link share: copies reading URL to clipboard with success toast notification
6. Default share text template: "[App Name] revealed [Card Name] for me today ✨ Discover your cards too!"
7. Share text customizable: user can edit text before posting (on supported platforms)
8. Share image attached automatically to share actions
9. Share analytics tracked: platform chosen, share completed, share cancelled
10. Mobile native share: use Web Share API when available for better UX
11. Fallback: if share fails, show instructions to screenshot and share manually
12. Share button styling: prominent, clear icons, consistent with app design

---

## Story 3.3: Open Graph & Social Media Meta Tags

**As a** marketer,  
**I want** proper social media meta tags on all pages,  
**so that** when users share links, they display beautifully with images and descriptions.

### Acceptance Criteria

1. Open Graph (OG) tags implemented on all public pages: og:title, og:description, og:image, og:url, og:type
2. Twitter Card tags: twitter:card, twitter:title, twitter:description, twitter:image
3. Homepage OG image: attractive hero image showcasing app features
4. Reading result pages: dynamic OG image based on cards drawn (if shareable)
5. Encyclopedia pages: each card has unique OG image and description
6. OG image requirements: 1200×630px, < 1MB, properly hosted on CDN
7. Meta descriptions: SEO-optimized, 150-160 characters, includes keywords
8. Facebook Sharing Debugger tested: OG tags validate successfully
9. Twitter Card Validator tested: Twitter cards display correctly
10. Dynamic meta tags: Next.js Metadata API used for page-specific tags
11. Fallback image: if specific OG image not available, use default branded image

---

## Story 3.4: Tarot Encyclopedia - Card Database Page

**As a** user interested in learning about tarot,  
**I want** to browse all 78 tarot cards and their meanings,  
**so that** I can deepen my understanding and discover new insights.

### Acceptance Criteria

1. Encyclopedia main page (`/cards`) created with all 78 cards displayed
2. Card grid layout: responsive grid (3-4 cards per row on desktop, 2 on mobile)
3. Each card thumbnail shows: card image, card name (Thai + English)
4. Cards organized by suit: Major Arcana (22 cards), Wands, Cups, Swords, Pentacles (14 cards each)
5. Tab navigation or sections: switch between suits easily
6. Card thumbnails clickable: navigate to individual card detail page
7. Visual hierarchy: Major Arcana highlighted as special (different styling)
8. Lazy loading: card images load progressively as user scrolls
9. Search functionality (basic): search box filters cards by name
10. Filter options: "All cards", "Major Arcana", "Minor Arcana", by suit
11. SEO optimized: page title "Tarot Card Encyclopedia | 78 Cards Meanings", proper heading structure
12. Breadcrumbs: Home > Encyclopedia
13. Mobile friendly: grid adapts to mobile screens, touch-friendly
14. Loading state: skeleton screens while cards load

---

## Story 3.5: Tarot Encyclopedia - Individual Card Pages

**As a** user,  
**I want** to read detailed information about each tarot card,  
**so that** I can understand its symbolism and apply it to my life.

### Acceptance Criteria

1. Card detail page (`/cards/[slug]`) created for each of 78 cards
2. URL structure: SEO-friendly slugs (e.g., `/cards/the-fool`, `/cards/ace-of-cups`)
3. Page content includes:
   - Large card image (high quality)
   - Card name (Thai + English)
   - Card number and suit
   - Upright meaning (3-4 paragraphs, detailed)
   - Reversed meaning (3-4 paragraphs)
   - Keywords (upright and reversed)
   - Symbolism explanation (visual elements in card)
   - Advice section (how to apply this card's wisdom)
4. Related cards section: "Cards often drawn together" or "Similar energy cards"
5. CTA button: "Get your reading with this card" links to reading selection page
6. Breadcrumbs: Home > Encyclopedia > [Card Name]
7. Navigation: Previous/Next card buttons for browsing
8. Mobile responsive: all content readable and well-formatted on mobile
9. SEO optimized:
   - Page title: "[Card Name] Tarot Card Meaning - [App Name]"
   - Meta description: first 160 characters of upright meaning
   - H1: Card name, H2: sections (Upright, Reversed, Symbolism, etc.)
   - Structured data: Article schema with card information
10. Social sharing: Share buttons on card pages for educational content
11. Internal linking: link to related reading types or other cards where relevant
12. Print-friendly: CSS print styles for users who want to print card meanings

---

## Story 3.6: Encyclopedia Search & Filter Enhancement

**As a** user,  
**I want** advanced search and filtering options,  
**so that** I can quickly find specific cards or cards with certain characteristics.

### Acceptance Criteria

1. Search functionality: real-time search as user types (debounced)
2. Search matches: card name (Thai + English), keywords, meanings
3. Search results highlighted: matching text highlighted in results
4. Filter by suit: Major Arcana, Wands, Cups, Swords, Pentacles, All
5. Filter by element (Minor Arcana): Fire (Wands), Water (Cups), Air (Swords), Earth (Pentacles)
6. Filter by card type: Court cards (Page, Knight, Queen, King), Numbered cards, Major Arcana
7. Sort options: alphabetical, by suit, by number
8. Filter persistence: selected filters saved in URL query params (shareable, bookmarkable)
9. Clear filters button: reset all filters and search
10. Results count: "Showing X of 78 cards"
11. Empty state: "No cards found" with suggestion to clear filters
12. Mobile filters: collapsible filter panel on mobile, bottom sheet or modal
13. Performance: filtering and search instant, no lag

---

## Story 3.7: SEO Content Strategy Implementation

**As a** SEO specialist,  
**I want** comprehensive on-page SEO for encyclopedia pages,  
**so that** we rank well in search engines for tarot-related queries.

### Acceptance Criteria

1. Keyword research completed: identify high-volume, low-competition keywords (e.g., "ความหมายไพ่ยิปซี", "tarot card meanings")
2. Target keywords integrated naturally into card page content
3. Internal linking strategy: link related cards, reading types, homepage
4. Structured data (JSON-LD): Article, BreadcrumbList, WebSite schemas implemented
5. Image alt text: descriptive alt text for all card images (accessibility + SEO)
6. Page speed optimized: Lighthouse SEO score ≥95
7. Mobile-friendly: passes Google Mobile-Friendly Test
8. XML sitemap: updated to include all encyclopedia pages
9. Robots.txt: allow crawling of /cards/* pages
10. Canonical URLs: prevent duplicate content issues
11. Schema markup tested: Google Rich Results Test validates schemas
12. SEO analytics: Google Search Console configured, track impressions, clicks, rankings

---

## Story 3.8: Content Marketing Blog Foundation

**As a** content marketer,  
**I want** a blog section for educational tarot content,  
**so that** we can attract organic traffic and establish thought leadership.

### Acceptance Criteria

1. Blog main page (`/blog`) created with list of blog posts
2. Blog post template: title, author, publish date, featured image, content, tags
3. Initial blog posts (3-5 posts):
   - "How to Read Tarot Cards for Beginners"
   - "Daily Tarot Reading: Benefits and How to Start"
   - "Understanding the Major Arcana: A Complete Guide"
   - "3-Card Spread Explained: Past, Present, Future"
   - "Top 5 Tarot Cards for Guidance in Love and Career"
4. Blog post page (`/blog/[slug]`) with full content, SEO-optimized
5. Category tags: Beginners, Advanced, Spreads, Card Meanings, Spiritual Growth
6. Related posts section: show 3 related articles at bottom
7. CTA in posts: "Try your reading now" links to reading selection
8. Author bio: brief info about content creator (builds trust)
9. Social share buttons on blog posts
10. SEO optimized: proper headings, meta descriptions, keywords, structured data (Article)
11. Blog RSS feed: `/blog/feed.xml` for subscribers
12. Comment system (optional future): Disqus or custom comments for engagement

---

## Story 3.9: Landing Page SEO & Conversion Optimization

**As a** growth marketer,  
**I want** the landing page optimized for both SEO and conversions,  
**so that** organic traffic converts into active users.

### Acceptance Criteria

1. Hero section optimized: clear value proposition, keywords included naturally
2. Primary CTA prominent: "เริ่มดูดวงฟรี" (Start Free Reading) above the fold
3. Secondary CTAs: "เรียนรู้เพิ่มเติม" (Learn More), "ดูคู่มือไพ่" (View Card Guide)
4. Social proof section: "X users trusted us" or testimonials (if available)
5. Feature highlights: 3-4 key features with icons (Free, Fast, Accurate, Save History)
6. How it works section: 3-step visual guide (Select → Draw → Discover)
7. FAQ section: 5-7 common questions about tarot, app usage, privacy
8. Trust signals: privacy badge, secure icon, PDPA compliance note
9. SEO optimized:
   - H1: Main keyword "ดูดวงไพ่ยิปซีออนไลน์ฟรี" or similar
   - Meta title: "ดูดวงไพ่ยิปซีออนไลน์ | [App Name] - ฟรี แม่นยำ"
   - Meta description: compelling, includes keywords, call-to-action
10. A/B test ready: structure allows testing different headlines, CTAs
11. Conversion tracking: GA4 events for CTA clicks, scroll depth, time on page
12. Mobile optimized: all sections work perfectly on mobile, thumb-friendly CTAs

---

## Story 3.10: Analytics & Growth Metrics Dashboard

**As a** product manager,  
**I want** visibility into content performance and sharing metrics,  
**so that** we can optimize our growth strategy based on data.

### Acceptance Criteria

1. GA4 events for social sharing: share_initiated, share_completed, platform (Instagram/Facebook/Twitter)
2. Encyclopedia analytics: page views per card, most viewed cards, search queries
3. Blog analytics: post views, read time, scroll depth, exit rate
4. Referral tracking: track traffic from social media shares (UTM parameters)
5. Conversion funnel: encyclopedia/blog visitor → reading user → signed up user
6. SEO metrics: organic traffic, top landing pages, keyword rankings (via Search Console)
7. Engagement metrics: bounce rate, pages per session, average session duration
8. Content performance report: which cards/posts drive most traffic and conversions
9. Share virality metric: shares per reading, viral coefficient calculation
10. Dashboard view: PostHog or Vercel Analytics dashboard showing key growth metrics
11. Weekly/monthly reports: automated email or Slack report with key metrics (future)
12. A/B testing infrastructure: ability to test different share images, CTAs, content formats

---

## Story 3.11: Share Incentives & Gamification

**As a** user,  
**I want** to feel rewarded when I share readings,  
**so that** I'm motivated to spread the word about the app.

### Acceptance Criteria

1. Share prompt after reading: "Love your reading? Share it with friends!" (subtle, not pushy)
2. Share badge: after first share, unlock "Sharer" badge in profile (gamification)
3. Social proof: "X people shared their readings today" shown somewhere (FOMO)
4. Thank you message after share: "Thank you for sharing! Your friends will love this too ✨"
5. Referral foundation (future monetization): track if new users came from shared link (cookie or URL param)
6. Sharing stats in profile: "You've shared X readings" (for logged-in users)
7. Share streaks (future): encourage consistent sharing
8. Leaderboard (future consideration): top sharers (only if appropriate for brand)
9. No spam: never auto-post to social media, always user-initiated
10. Respectful UX: sharing is encouraged but never forced, user can dismiss prompts

---

## Story 3.12: Encyclopedia Content Quality Assurance

**As a** content manager,  
**I want** all tarot card content reviewed for accuracy and consistency,  
**so that** users trust our interpretations and find them helpful.

### Acceptance Criteria

1. All 78 cards content written and reviewed by tarot expert
2. Content style guide followed: tone, length, structure consistent across all cards
3. Thai language quality: grammatically correct, natural flow, no literal translations
4. Accuracy check: meanings align with traditional tarot interpretations (Rider-Waite or chosen deck)
5. Completeness: every card has upright, reversed, keywords, symbolism, advice sections
6. Readability: Flesch reading ease score appropriate for target audience (not too complex)
7. Unique content: not copied from other sources (plagiarism check)
8. SEO keywords naturally integrated: not keyword-stuffed, reads naturally
9. Internal consistency: related cards referenced correctly, no contradictions
10. User testing: 5-10 users read sample card pages, provide feedback on clarity and helpfulness
11. Revision based on feedback: content updated if users find it confusing or unhelpful
12. Final approval: content writer and product owner sign off before launch

---

## Story 3.13: Epic 3 Testing & Quality Assurance

**As a** QA tester,  
**I want** thorough testing of sharing and encyclopedia features,  
**so that** we ship high-quality content and smooth sharing experiences.

### Acceptance Criteria

1. Social sharing tested on actual devices: iPhone (Instagram, Facebook, Twitter), Android
2. Share image generation: verify images look good, proper dimensions, no cut-off text
3. Cross-platform sharing: test on multiple social platforms, verify posts appear correctly
4. Encyclopedia navigation: all 78 cards accessible, no broken links
5. Search and filter testing: verify results accurate, no errors with edge cases
6. SEO validation: Google Rich Results Test passes for all card pages and blog posts
7. Mobile responsiveness: all encyclopedia and blog pages work perfectly on mobile
8. Content proofreading: spell check, grammar check on all copy
9. Link checking: all internal and external links work (no 404s)
10. Analytics verification: all tracking events fire correctly
11. Performance testing: encyclopedia pages load quickly (< 2s)
12. Accessibility testing: screen reader compatible, keyboard navigable
13. Cross-browser testing: Safari, Chrome, Firefox on desktop and mobile
14. All P0 and P1 bugs fixed before shipping

---
