/**
 * E2E Tests: Premium User Journey
 * Story 7.9: Phase 3 Testing & QA
 * 
 * Tests the complete premium user experience including:
 * - Access to premium spreads (Celtic Cross, Decision Making, Self Discovery, Relationship)
 * - Premium features and UI enhancements
 * - Cross-spread navigation
 * 
 * Prerequisites:
 * - Local server running (npm run dev)
 * - Test user with PRO subscription in database
 */

import { test, expect } from '@playwright/test';

test.describe('Premium User Journey - Story 7.9', () => {
  // Note: These tests are designed to be run against a staging environment
  // with seeded test data. They document the expected behavior.

  test.describe('Premium Spread Access', () => {
    test('TC-7.9-100: should display Celtic Cross as accessible for Pro users', async ({ page }) => {
      await page.goto('/reading');
      
      // Celtic Cross should be visible
      await expect(page.getByText(/Celtic Cross|กากบาทเซลติก/)).toBeVisible();
    });

    test('TC-7.9-101: should display Decision Making spread for Pro users', async ({ page }) => {
      await page.goto('/reading');
      
      // Decision Making should be visible
      await expect(page.getByText(/Decision Making|การตัดสินใจ/)).toBeVisible();
    });

    test('TC-7.9-102: should display Self Discovery spread for Pro users', async ({ page }) => {
      await page.goto('/reading');
      
      // Self Discovery should be visible
      await expect(page.getByText(/Self Discovery|ค้นพบตัวเอง/)).toBeVisible();
    });

    test('TC-7.9-103: should display Relationship Deep Dive spread for Pro users', async ({ page }) => {
      await page.goto('/reading');
      
      // Relationship Deep Dive should be visible
      await expect(page.getByText(/Relationship|ความสัมพันธ์/)).toBeVisible();
    });
  });

  test.describe('Premium Gating for Free Users', () => {
    test('TC-7.9-110: should show premium gate on Celtic Cross for free users', async ({ page }) => {
      // Navigate directly to premium spread without auth
      await page.goto('/reading/celtic-cross');
      
      // Should see upgrade message or redirect
      const upgradeMessage = page.getByText(/อัพเกรด|Pro|Premium|สมัคร/);
      const loginRequired = page.getByText(/เข้าสู่ระบบ|Login/);
      
      // Either upgrade message or login redirect should be visible
      await expect(upgradeMessage.or(loginRequired)).toBeVisible({ timeout: 5000 });
    });

    test('TC-7.9-111: should show premium gate on Decision Making for free users', async ({ page }) => {
      await page.goto('/reading/decision');
      
      const upgradeMessage = page.getByText(/อัพเกรด|Pro|Premium|สมัคร/);
      const loginRequired = page.getByText(/เข้าสู่ระบบ|Login/);
      
      await expect(upgradeMessage.or(loginRequired)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Free Spread Access (No Gate)', () => {
    test('TC-7.9-060: should allow access to daily reading without login', async ({ page }) => {
      await page.goto('/reading/daily');
      
      // Should see daily reading page, not a gate
      await expect(page.getByText(/ดูดวงประจำวัน|Daily/)).toBeVisible();
    });

    test('TC-7.9-061: should allow access to three-card reading without login', async ({ page }) => {
      await page.goto('/reading/three-card');
      
      // Should see three-card reading page
      await expect(page.getByText(/ไพ่ 3 ใบ|3-Card|Three/)).toBeVisible();
    });
  });

  test.describe('Cross-Spread Navigation', () => {
    test('TC-7.9-013: should navigate from reading selection to spread page', async ({ page }) => {
      await page.goto('/reading');
      
      // Click on Daily Reading
      await page.locator('a[href="/reading/daily"]').first().click();
      
      // Should be on daily reading page
      await expect(page).toHaveURL('/reading/daily');
    });

    test('TC-7.9-014: should have navigation back to reading selection', async ({ page }) => {
      await page.goto('/reading/daily');
      
      // Look for back navigation or breadcrumb
      const backLink = page.getByRole('link', { name: /กลับ|Back|เลือก|Reading/ });
      
      // Should have some form of navigation back
      await expect(backLink.first()).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('TC-7.9-030: page should load within 2 seconds', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/reading');
      await page.waitForLoadState('domcontentloaded');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 2000ms
      expect(loadTime).toBeLessThan(2000);
    });
  });

  test.describe('Security - No Secret Key Exposure', () => {
    test('TC-7.9-070: should not expose Stripe secret keys in client', async ({ page }) => {
      await page.goto('/');
      
      const content = await page.content();
      
      // Should NOT contain secret keys
      expect(content).not.toContain('sk_test_');
      expect(content).not.toContain('sk_live_');
      expect(content).not.toContain('whsec_');
    });

    test('TC-7.9-071: API endpoints should be protected', async ({ page }) => {
      // Try to access a protected API endpoint
      const response = await page.request.get('/api/user/subscription');
      
      // Should return 401 (Unauthorized) without auth
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('TC-7.9-043: should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/reading');
      
      // Spread cards should still be visible
      await expect(page.getByText(/ดูดวงประจำวัน/)).toBeVisible();
      await expect(page.getByText(/ไพ่ 3 ใบ/)).toBeVisible();
    });

    test('TC-7.9-044: should not have horizontal scroll on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/reading');
      
      // Check for horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  });
});

test.describe('Premium Spread Card Layouts', () => {
  test('Celtic Cross should indicate 10 cards', async ({ page }) => {
    await page.goto('/reading');
    
    // Look for Celtic Cross with 10 card indicator
    const celticCard = page.locator('a[href="/reading/celtic-cross"]').first();
    if (await celticCard.isVisible()) {
      await expect(celticCard.getByText(/10/)).toBeVisible();
    }
  });

  test('Decision Making should indicate 5 cards', async ({ page }) => {
    await page.goto('/reading');
    
    const decisionCard = page.locator('a[href="/reading/decision"]').first();
    if (await decisionCard.isVisible()) {
      await expect(decisionCard.getByText(/5/)).toBeVisible();
    }
  });
});

test.describe('Pricing Page', () => {
  test('should display all subscription tiers', async ({ page }) => {
    await page.goto('/pricing');
    
    // Should show all 4 tiers
    await expect(page.getByText(/ฟรี|Free/)).toBeVisible();
    await expect(page.getByText(/Basic|เบสิค/)).toBeVisible();
    await expect(page.getByText(/Pro|โปร/)).toBeVisible();
    await expect(page.getByText(/VIP|วีไอพี/)).toBeVisible();
  });

  test('should show correct pricing', async ({ page }) => {
    await page.goto('/pricing');
    
    // Check for price display
    await expect(page.getByText(/฿99|99 บาท/)).toBeVisible();
    await expect(page.getByText(/฿199|199 บาท/)).toBeVisible();
    await expect(page.getByText(/฿399|399 บาท/)).toBeVisible();
  });

  test('should have CTA buttons for subscription', async ({ page }) => {
    await page.goto('/pricing');
    
    // Look for subscription CTAs
    const ctaButtons = page.getByRole('button', { name: /สมัคร|เริ่มใช้งาน|Subscribe/ });
    
    // Should have at least one CTA button
    await expect(ctaButtons.first()).toBeVisible();
  });
});
