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
      
      // Check career spread card is visible
      await expect(page.getByText('ดูดวงการงาน')).toBeVisible();
      await expect(page.getByText('Career & Money')).toBeVisible();
      
      // Check login required badge
      await expect(page.getByText('ต้องเข้าสู่ระบบ').first()).toBeVisible();
    });

    test('should link to career spread page from reading selection', async ({ page }) => {
      await page.goto('/reading');
      
      // Click on career spread card
      await page.click('text=ดูดวงการงาน');
      
      // Should navigate to career page (or redirect to login)
      await expect(page).toHaveURL(/\/reading\/career|\/auth\/login/);
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
    expect(loadTime).toBeLessThan(3000);
    
    // Check content is visible
    await expect(page.getByText('ดูดวงการงาน')).toBeVisible({ timeout: 2000 });
  });
});

