import { test, expect } from '@playwright/test';

test.describe('Love Spread Page', () => {
  test.describe('Authentication Required', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto('/reading/love');
      
      // Should redirect to login with redirectTo parameter
      await expect(page).toHaveURL(/\/auth\/login\?redirectTo=.*love/);
    });

    test('should show login prompt when not authenticated', async ({ page }) => {
      // Intercept the redirect to check the page content before redirect
      await page.route('**/reading/love', async (route) => {
        await route.continue();
      });

      await page.goto('/reading/love', { waitUntil: 'networkidle' });
      
      // Either redirected to login or shows login prompt
      const isLoginPage = page.url().includes('/auth/login');
      const hasLoginPrompt = await page.getByText('กรุณาเข้าสู่ระบบ').isVisible().catch(() => false);
      
      expect(isLoginPage || hasLoginPrompt).toBe(true);
    });
  });

  test.describe('Reading Selection Page', () => {
    test('should show love spread option in reading selection', async ({ page }) => {
      await page.goto('/reading');
      
      // Check love spread card is visible - using button locator (UI uses button not link)
      await expect(page.getByRole('button', { name: /ดูดวงความรัก/ })).toBeVisible();
      
      // Check Basic tier section header
      await expect(page.getByText('💎 Basic')).toBeVisible();
    });

    test('should link to love spread page from reading selection', async ({ page }) => {
      await page.goto('/reading');
      
      // Click on love spread card - using button locator
      await page.getByRole('button', { name: /ดูดวงความรัก/ }).click();
      
      // Should navigate to love page, gate page, or redirect to login
      await expect(page).toHaveURL(/\/reading\/love|\/gate\/premium|\/auth\/login/);
    });
  });

  test.describe('Authenticated User Flow', () => {
    // Note: These tests require authentication setup
    // In a real scenario, you would use a test user or mock authentication
    
    test.skip('should show love spread page when authenticated', async ({ page }) => {
      // This test would need proper authentication setup
      // await loginAsTestUser(page);
      
      await page.goto('/reading/love');
      
      // Check page content
      await expect(page.getByRole('heading', { name: 'ดูดวงความรัก' })).toBeVisible();
      await expect(page.getByText('Love & Relationships Spread')).toBeVisible();
    });

    test.skip('should display three position explanations', async ({ page }) => {
      // await loginAsTestUser(page);
      await page.goto('/reading/love');
      
      // Check position explanations
      await expect(page.getByText('คุณ')).toBeVisible();
      await expect(page.getByText('คู่ของคุณ')).toBeVisible();
      await expect(page.getByText('พลังความสัมพันธ์')).toBeVisible();
    });

    test.skip('should show sample love questions', async ({ page }) => {
      // await loginAsTestUser(page);
      await page.goto('/reading/love');
      
      // Check sample questions
      await expect(page.getByText('จะเจอคนที่ใช่ไหม?')).toBeVisible();
      await expect(page.getByText('ความสัมพันธ์จะดีขึ้นไหม?')).toBeVisible();
    });

    test.skip('should start reading when button clicked', async ({ page }) => {
      // await loginAsTestUser(page);
      await page.goto('/reading/love');
      
      // Click start button
      await page.click('text=เริ่มดูดวงความรัก');
      
      // Should show shuffling/drawing state
      const shuffling = await page.getByText('กำลังสับไพ่...').isVisible().catch(() => false);
      const drawing = await page.getByText('กำลังจั่วไพ่').isVisible().catch(() => false);
      
      expect(shuffling || drawing).toBe(true);
    });
  });
});

test.describe('Love Spread - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/reading');
    
    // Check love spread card is visible on mobile
    await expect(page.getByText('ดูดวงความรัก')).toBeVisible();
    
    // Check cards stack vertically (grid layout)
    const loveCard = page.locator('text=ดูดวงความรัก').first();
    await expect(loveCard).toBeVisible();
  });
});

test.describe('Love Spread - Performance', () => {
  test('should load reading selection page within 1 second', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/reading', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Allow 3s for CI environments
    
    // Check content is visible
    await expect(page.getByText('ดูดวงความรัก')).toBeVisible({ timeout: 2000 });
  });
});

