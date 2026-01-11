import { test, expect } from '@playwright/test';

test.describe('Value Proposition E2E Tests', () => {
  test('should display spreads section on landing page', async ({ page }) => {
    await page.goto('/');

    // Check for free spreads - using partial text matching
    await expect(page.getByRole('link', { name: /ดูดวงประจำวัน/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /ไพ่ 3 ใบ/ })).toBeVisible();

    // Check for locked spreads 
    await expect(page.getByRole('link', { name: /ดูดวงความรัก/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /ดูดวงการงาน/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Yes\/No|Ye \/No/ })).toBeVisible();

    // Check for signup CTA
    await expect(page.getByRole('link', { name: /สมัครฟรี/ })).toBeVisible();
  });

  test('should show value proposition on signup page', async ({ page }) => {
    await page.goto('/auth/signup');

    // Check for value proposition section
    await expect(page.getByText('ปลดล็อค 3 รูปแบบพิเศษฟรี!')).toBeVisible();
    await expect(page.getByText('สมัครแล้วได้อะไรบ้าง?')).toBeVisible();

    // Check for spread cards
    await expect(page.getByText('ความรัก')).toBeVisible();
    await expect(page.getByText('การงาน')).toBeVisible();
  });

  test('should navigate to signup from landing page CTA', async ({ page }) => {
    await page.goto('/');

    // Click signup CTA in spreads section
    await page.getByRole('link', { name: 'สมัครฟรี' }).first().click();

    // Should be on signup page
    await expect(page).toHaveURL('/auth/signup');
  });

  test('should show lock icons on protected spreads', async ({ page }) => {
    await page.goto('/');

    // Find love spread card and check for lock
    const loveCard = page.locator('a[href="/reading/love"]').first();
    await expect(loveCard).toBeVisible();

    // The lock icon should be present
    await expect(loveCard.getByText('🔐')).toBeVisible();
  });

  test('clicking locked spread on landing page should redirect to login', async ({ page }) => {
    await page.goto('/');

    // Click on love spread (protected)
    await page.locator('a[href="/reading/love"]').first().click();

    // Should redirect to login with redirectTo param
    await expect(page).toHaveURL(/auth\/login\?redirectTo=\/reading\/love/);
  });
});

test.describe('Reading Selection Page', () => {
  test('should display all 5 spreads on reading selection page', async ({ page }) => {
    await page.goto('/reading');

    // Check all spreads are visible
    await expect(page.getByText('ดูดวงประจำวัน')).toBeVisible();
    await expect(page.getByText('ไพ่ 3 ใบ')).toBeVisible();
    await expect(page.getByText('ดูดวงความรัก')).toBeVisible();
    await expect(page.getByText('ดูดวงการงาน')).toBeVisible();
    await expect(page.getByText('Yes/No Question')).toBeVisible();
  });

  test('should show login required badges on protected spreads', async ({ page }) => {
    await page.goto('/reading');

    // Check for login required indicators
    const loveCard = page.locator('a[href="/reading/love"]');
    await expect(loveCard.getByText('ต้องเข้าสู่ระบบ')).toBeVisible();

    const careerCard = page.locator('a[href="/reading/career"]');
    await expect(careerCard.getByText('ต้องเข้าสู่ระบบ')).toBeVisible();

    const yesNoCard = page.locator('a[href="/reading/yes-no"]');
    await expect(yesNoCard.getByText('ต้องเข้าสู่ระบบ')).toBeVisible();
  });
});

test.describe('Post-Signup Celebration', () => {
  test.skip('should show unlocked spreads modal after signup', async ({ page }) => {
    // This test would require mocking the signup flow
    // Navigate to home with welcome param
    await page.goto('/?welcome=true');

    // Modal should appear
    await expect(page.getByText('ยินดีด้วย!')).toBeVisible();
    await expect(page.getByText('คุณปลดล็อค 3 รูปแบบพิเศษแล้ว')).toBeVisible();

    // Should show unlocked spreads
    await expect(page.getByText('ดูดวงความรัก')).toBeVisible();
    await expect(page.getByText('ดูดวงการงาน')).toBeVisible();
    await expect(page.getByText('Yes/No Question')).toBeVisible();
  });

  test.skip('should close modal and navigate to reading', async ({ page }) => {
    await page.goto('/?welcome=true');

    // Click start reading button
    await page.getByRole('link', { name: 'เริ่มดูดวงเลย' }).click();

    // Should navigate to reading page
    await expect(page).toHaveURL('/reading');
  });
});

test.describe('Analytics Tracking', () => {
  test.skip('should track signup_trigger_spread when clicking signup from spread card', async ({ page }) => {
    // Would need to mock analytics and verify events
  });

  test.skip('should track unlocked_spreads_modal_shown when modal appears', async ({ page }) => {
    // Would need to mock analytics and verify events
  });
});

