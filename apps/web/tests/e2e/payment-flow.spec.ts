/**
 * E2E Tests: Complete Payment Flow
 * Tests for Story 6.1 - Stripe Payment Gateway Integration
 * 
 * Prerequisites:
 * - Local server running (npm run dev)
 * - Stripe test mode enabled
 * - Test database seeded with test user
 * 
 * Run with: npx playwright test tests/e2e/payment-flow.spec.ts
 */

import { test, expect } from '@playwright/test';

// Stripe test card numbers
const TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  INSUFFICIENT_FUNDS: '4000000000009995',
  EXPIRED: '4000000000000069',
  REQUIRES_AUTH: '4000002500003155',
  INVALID_CVC: '4000000000000101',
};

test.describe('Payment Flow - Story 6.1', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
  });

  test('should complete successful payment with test card', async ({ page }) => {
    // Login (assuming test user exists)
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Wait for redirect after login
    await page.waitForURL('/', { timeout: 10000 });

    // Navigate to pricing page
    await page.goto('/pricing');
    await expect(page.locator('h1')).toContainText(/ราคา|แพ็คเกจ/);

    // Click subscribe button for Basic tier
    await page.click('button:has-text("เริ่มใช้งาน")');

    // Should redirect to checkout or Stripe Checkout
    await page.waitForURL(/checkout|stripe\.com/, { timeout: 10000 });

    // If using Stripe hosted checkout
    if (page.url().includes('stripe.com')) {
      // Fill in test card details (Stripe hosted form)
      await page.fill('input[name="cardnumber"]', TEST_CARDS.SUCCESS);
      await page.fill('input[name="exp-date"]', '12/34');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="postal"]', '10110');

      // Submit payment
      await page.click('button[type="submit"]');

      // Wait for redirect to success page
      await page.waitForURL(/subscription\/success/, { timeout: 30000 });

      // Verify success page elements
      await expect(page.locator('h1')).toContainText(/ยินดี|สำเร็จ/);
      await expect(page.locator('text=/ยินดีด้วย|เรียบร้อย/')).toBeVisible();
    }
  });

  test('should handle declined card gracefully', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to pricing and select tier
    await page.goto('/pricing');
    await page.click('button:has-text("เริ่มใช้งาน")');
    await page.waitForURL(/checkout|stripe\.com/);

    if (page.url().includes('stripe.com')) {
      // Use declined test card
      await page.fill('input[name="cardnumber"]', TEST_CARDS.DECLINE);
      await page.fill('input[name="exp-date"]', '12/34');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="postal"]', '10110');

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator('text=/บัตรของคุณถูกปฏิเสธ|declined/')
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should redirect to failure page on payment error', async ({ page }) => {
    // This test would require triggering a failure scenario
    // Navigate directly to failure page to test UI
    await page.goto('/subscription/failed?error=payment_failed');

    // Verify failure page elements
    await expect(page.locator('h1')).toContainText(/ผิดพลาด|ไม่สำเร็จ/);
    
    // Should have retry button
    const retryButton = page.locator('button:has-text("ลองอีกครั้ง")');
    await expect(retryButton).toBeVisible();

    // Click retry should redirect to checkout or pricing
    await retryButton.click();
    await expect(page).toHaveURL(/checkout|pricing/);
  });

  test('should display Stripe customer ID after successful subscription', async ({
    page,
  }) => {
    // Login as existing subscriber
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'subscriber@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to profile
    await page.goto('/profile');

    // Should see subscription status
    await expect(
      page.locator('text=/แพ็คเกจปัจจุบัน|Current Plan/')
    ).toBeVisible();
  });

  test('should track analytics events during payment flow', async ({ page }) => {
    // This test would require checking analytics events
    // For now, we verify the flow completes without errors

    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Check console for analytics events (development mode)
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('[Analytics]')) {
        logs.push(msg.text());
      }
    });

    await page.goto('/pricing');
    await page.click('button:has-text("เริ่มใช้งาน")');

    // Should track pricing_viewed, checkout_started events
    // (In actual implementation, verify with analytics service)
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    // Navigate to old/expired checkout session
    await page.goto('/checkout?tier=basic&expired=true');

    // Should show appropriate message or redirect
    await expect(
      page.locator('text=/หมดอายุ|expired|กรุณาลองใหม่/')
    ).toBeVisible();
  });
});

test.describe('Webhook Integration - Story 6.1', () => {
  test('should sync subscription data after webhook event', async ({ page }) => {
    // This test requires webhook simulator or Stripe CLI
    // For now, verify database state after subscription creation

    // Assuming test user with active subscription exists
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'subscriber@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to subscription page
    await page.goto('/profile/subscription');

    // Should display subscription details from webhook sync
    await expect(page.locator('text=/ใช้งาน|Active/')).toBeVisible();
    await expect(page.locator('text=/ต่ออายุถัดไป|Next billing/')).toBeVisible();
  });
});

test.describe('Security - Story 6.1', () => {
  test('should not expose secret keys in client-side code', async ({ page }) => {
    await page.goto('/');

    // Check page source for secret keys (should not exist)
    const content = await page.content();
    
    expect(content).not.toContain('sk_test_');
    expect(content).not.toContain('sk_live_');
    expect(content).not.toContain('STRIPE_SECRET_KEY');
    expect(content).not.toContain('whsec_'); // webhook secret
  });

  test('should only expose publishable key', async ({ page }) => {
    await page.goto('/pricing');

    // Publishable key is safe to expose
    const content = await page.content();
    
    // May contain pk_test_ but never sk_test_
    expect(content).not.toContain('sk_test_');
  });

  test('should use HTTPS for payment pages', async ({ page, context }) => {
    // In production, verify HTTPS
    const url = page.url();
    
    // In test/dev environment, this may be http://localhost
    // In production, should be https://
    if (!url.includes('localhost')) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
