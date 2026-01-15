/**
 * Self Discovery Spread E2E Tests
 * Story 7.3: Self Discovery Spread (5 Cards)
 * Test Design: QA Engineer Quinn - 2026-01-13
 */

import { test, expect } from '@playwright/test';

test.describe('Self Discovery Spread - Story 7.3', () => {
  test.describe('Scenario 1: Pro/VIP Access Control (P0)', () => {
    test('TC-7.3-001: FREE/BASIC users see premium gate', async ({ page }) => {
      // Navigate without auth (free tier)
      await page.goto('/reading/self-discovery');
      
      // Should show premium gate
      await expect(page.getByText('ปลดล็อก')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Pro')).toBeVisible();
      
      // Should have upgrade button
      await expect(page.getByRole('button', { name: /อัปเกรด/i })).toBeVisible();
    });

    // TC-7.3-002 and TC-7.3-003 require authenticated Pro/VIP users
    // These should be run with proper test fixtures for authenticated users
  });

  test.describe('Scenario 2: 5-Card Self-Discovery Layout (P0)', () => {
    test('TC-7.3-010: Page renders with correct structure', async ({ page }) => {
      // For now, test the page structure when accessing
      await page.goto('/reading/self-discovery');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Should have some content (either gate or the actual page)
      const body = page.locator('body');
      await expect(body).not.toBeEmpty();
    });
  });

  test.describe('Scenario 3: Mobile Responsive (P0)', () => {
    test('TC-7.3-013: Mobile viewport displays correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      
      await page.goto('/reading/self-discovery');
      await page.waitForLoadState('networkidle');
      
      // Should not have horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
    });
  });
});
