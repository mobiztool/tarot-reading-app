import { test, expect } from '@playwright/test';

test.describe('Career Spread Page', () => {
  test.describe('Authentication Required', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto('/reading/career');
      
      // Should redirect to login with redirectTo parameter
      await expect(page).toHaveURL(/\/auth\/login\?redirectTo=.*career/);
    });
  });

  test.describe('Reading Selection Page', () => {
    test('should show career spread option in reading selection', async ({ page }) => {
      await page.goto('/reading');
      
      // Check career spread card is visible (UI uses button not link)
      await expect(page.getByRole('button', { name: /ดูดวงการงาน/ })).toBeVisible();
      
      // Check Basic tier section header
      await expect(page.getByText('💎 Basic')).toBeVisible();
    });

    test('should link to career spread page from reading selection', async ({ page }) => {
      await page.goto('/reading');
      
      // Click on career spread card
      await page.getByRole('button', { name: /ดูดวงการงาน/ }).click();
      
      // Should navigate to career page, gate page, or redirect to login
      await expect(page).toHaveURL(/\/reading\/career|\/gate\/premium|\/auth\/login/);
    });
  });

  test.describe('Authenticated User Flow', () => {
    test.skip('should show career spread page when authenticated', async ({ page }) => {
      await page.goto('/reading/career');
      
      // Check page content
      await expect(page.getByRole('heading', { name: 'ดูดวงการงานและการเงิน' })).toBeVisible();
      await expect(page.getByText('Career & Money Spread')).toBeVisible();
    });

    test.skip('should display three position explanations', async ({ page }) => {
      await page.goto('/reading/career');
      
      // Check position explanations
      await expect(page.getByText('สถานการณ์ปัจจุบัน')).toBeVisible();
      await expect(page.getByText('อุปสรรคและโอกาส')).toBeVisible();
      await expect(page.getByText('ผลลัพธ์')).toBeVisible();
    });

    test.skip('should show sample career questions', async ({ page }) => {
      await page.goto('/reading/career');
      
      // Check sample questions
      await expect(page.getByText('ควรเปลี่ยนงานหรือยัง?')).toBeVisible();
      await expect(page.getByText('การลงทุนนี้คุ้มค่าไหม?')).toBeVisible();
    });
  });
});

test.describe('Career Spread - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/reading');
    
    // Check career spread card is visible on mobile
    await expect(page.getByText('ดูดวงการงาน')).toBeVisible();
  });
});

test.describe('Career Spread - Performance', () => {
  test('should load reading selection page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/reading', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    // Allow 5s for CI/cold start environments
    expect(loadTime).toBeLessThan(5000);
    
    // Check content is visible
    await expect(page.getByRole('button', { name: /ดูดวงการงาน/ })).toBeVisible({ timeout: 3000 });
  });
});

