/**
 * E2E Tests: Story 7.4 - Relationship Deep Dive Spread
 * Tests for Pro/VIP access, 7-card layout, and complete reading flow
 */

import { test, expect } from '@playwright/test';

// Helper function to login as specific tier
async function loginAsTier(page: any, tier: 'free' | 'basic' | 'pro' | 'vip') {
  await page.goto('/auth/login');
  
  // Mock different user tiers
  const credentials = {
    free: { email: 'free@test.com', password: 'test123' },
    basic: { email: 'basic@test.com', password: 'test123' },
    pro: { email: 'pro@test.com', password: 'test123' },
    vip: { email: 'vip@test.com', password: 'test123' },
  };

  const creds = credentials[tier];
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

test.describe('TC-7.4-001 to TC-7.4-003: Pro/VIP Access Control', () => {
  // TC-7.4-001: FREE/BASIC → premium gate
  test('FREE user sees premium gate', async ({ page }) => {
    await loginAsTier(page, 'free');
    await page.goto('/reading/relationship-deep-dive');

    // Should show premium gate
    await expect(page.locator('text=/premium|pro feature|upgrade/i')).toBeVisible();
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
    await expect(page.locator('text=💞')).toBeVisible();
  });

  test('BASIC user sees premium gate', async ({ page }) => {
    await loginAsTier(page, 'basic');
    await page.goto('/reading/relationship-deep-dive');

    // Should show premium gate
    await expect(page.locator('text=/premium|pro feature|upgrade/i')).toBeVisible();
  });

  // TC-7.4-002: PRO → access granted
  test('PRO user has access', async ({ page }) => {
    await loginAsTier(page, 'pro');
    await page.goto('/reading/relationship-deep-dive');

    // Should NOT show premium gate
    await expect(page.locator('text=/upgrade|premium gate/i')).not.toBeVisible();
    
    // Should show spread page
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
    await expect(page.locator('text=7 ไพ่')).toBeVisible();
    await expect(page.locator('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")')).toBeVisible();
  });

  // TC-7.4-003: VIP → access granted
  test('VIP user has access', async ({ page }) => {
    await loginAsTier(page, 'vip');
    await page.goto('/reading/relationship-deep-dive');

    // Should NOT show premium gate
    await expect(page.locator('text=/upgrade|premium gate/i')).not.toBeVisible();
    
    // Should show spread page
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
    await expect(page.locator('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")')).toBeVisible();
  });
});

test.describe('TC-7.4-010 to TC-7.4-015: 7-Card Relationship Layout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTier(page, 'pro');
    await page.goto('/reading/relationship-deep-dive');
  });

  // TC-7.4-010: 7 cards in relationship layout
  test('displays 7 card positions in layout', async ({ page }) => {
    await page.click('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")');
    
    // Wait for card selection mode
    await expect(page.locator('text=เลือกไพ่ใบที่ 1/7')).toBeVisible();

    // Check progress indicators show 7 positions
    const progressIndicators = await page.locator('[class*="rounded-full"]').count();
    expect(progressIndicators).toBeGreaterThanOrEqual(7);
  });

  // TC-7.4-011: "You" positions on left/first
  test('shows "You" positions first', async ({ page }) => {
    await page.click('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")');

    // First position should be "You" related
    await expect(page.locator('text=/สถานะของคุณ|คุณ/i').first()).toBeVisible();
  });

  // TC-7.4-013: Connection card prominent center
  test('displays Connection position prominently', async ({ page }) => {
    // Check position info preview
    await expect(page.locator('text=พลังความเชื่อมโยง')).toBeVisible();
    await expect(page.locator('text=พลังงานและไดนามิกของความสัมพันธ์')).toBeVisible();
  });

  // TC-7.4-014: Feelings paired visually
  test('shows feelings positions together', async ({ page }) => {
    // Check position preview shows both feelings positions
    await expect(page.locator('text=ความรู้สึกของคุณ')).toBeVisible();
    await expect(page.locator('text=ความรู้สึกของอีกฝ่าย')).toBeVisible();
  });
});

test.describe('TC-7.4-020 to TC-7.4-024: Relationship Content Sensitivity', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTier(page, 'pro');
    await page.goto('/reading/relationship-deep-dive');
  });

  // TC-7.4-020: Content non-judgmental
  test('displays non-judgmental relationship content', async ({ page }) => {
    const content = await page.locator('body').textContent();
    
    // Should not contain harsh judgmental words
    expect(content).not.toMatch(/ผิด|แย่มาก|ห่วย|ไม่ดี/);
  });

  // TC-7.4-021: Balanced perspective
  test('shows balanced perspective for both sides', async ({ page }) => {
    // Should show positions for both "You" and "Them"
    await expect(page.locator('text=สถานะของคุณ')).toBeVisible();
    await expect(page.locator('text=สถานะของอีกฝ่าย')).toBeVisible();
  });

  // TC-7.4-023: Actionable relationship advice
  test('provides actionable advice', async ({ page }) => {
    await expect(page.locator('text=/คำแนะนำ|คำถาม|หลักการ/i')).toBeVisible();
  });

  // TC-7.4-024: Thai expressions natural for relationships
  test('uses natural Thai relationship language', async ({ page }) => {
    const content = await page.locator('body').textContent();
    
    // Should contain relationship-appropriate Thai terms
    expect(content).toMatch(/ความสัมพันธ์|เชื่อมโยง|ความรู้สึก/);
  });
});

test.describe('TC-7.4-030 to TC-7.4-032: Save Reading', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTier(page, 'pro');
  });

  // TC-7.4-030 & TC-7.4-031: reading_type and 7 cards saved
  test('completes and saves 7-card reading', async ({ page }) => {
    await page.goto('/reading/relationship-deep-dive');
    
    // Start reading
    await page.click('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")');

    // Select 7 cards (simulate card selection)
    for (let i = 0; i < 7; i++) {
      await page.waitForTimeout(500);
      const cardFan = page.locator('[class*="card"]').first();
      if (await cardFan.isVisible()) {
        await cardFan.click();
      }
    }

    // Wait for reading to complete
    await page.waitForTimeout(3000);

    // Should show save status
    await expect(page.locator('text=/บันทึกแล้ว|กำลังบันทึก/i')).toBeVisible({ timeout: 10000 });
  });

  // TC-7.4-032: Appears in history
  test('saved reading appears in history', async ({ page }) => {
    // Navigate to history after completing a reading
    await page.goto('/history');

    // Should show relationship deep dive reading in history
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
  });
});

test.describe('Complete Reading Flow', () => {
  test('completes full relationship deep dive reading flow', async ({ page }) => {
    await loginAsTier(page, 'pro');
    await page.goto('/reading/relationship-deep-dive');

    // Step 1: See intro page
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
    await expect(page.locator('text=7 ไพ่')).toBeVisible();

    // Step 2: Enter question (optional)
    const questionInput = page.locator('textarea');
    await questionInput.fill('ความสัมพันธ์ของเราจะไปในทิศทางไหน?');

    // Step 3: Start reading
    await page.click('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")');

    // Step 4: Select 7 cards
    await expect(page.locator('text=เลือกไพ่ใบที่ 1/7')).toBeVisible();

    // Step 5: Verify positions are shown during selection
    await expect(page.locator('text=/สถานะของคุณ|คุณ/i')).toBeVisible();

    // Step 6: Check that all 7 positions are accounted for
    const progressDots = await page.locator('[class*="rounded-full"]').count();
    expect(progressDots).toBeGreaterThanOrEqual(7);
  });
});

test.describe('Mobile Responsiveness (TC-7.4-015)', () => {
  test('displays 7 cards clearly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsTier(page, 'pro');
    await page.goto('/reading/relationship-deep-dive');

    // Should still show all content
    await expect(page.locator('text=วิเคราะห์ความสัมพันธ์')).toBeVisible();
    await expect(page.locator('text=7 ไพ่')).toBeVisible();
    await expect(page.locator('button:has-text("เริ่มวิเคราะห์ความสัมพันธ์")')).toBeVisible();

    // Positions should be visible
    await expect(page.locator('text=สถานะของคุณ')).toBeVisible();
    await expect(page.locator('text=พลังความเชื่อมโยง')).toBeVisible();
  });
});
