import { test, expect } from '@playwright/test';

test.describe('Template Authentication & Navigation Flows', () => {
  test('landing page loads properly with call-to-actions', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Build and Ship/i);
    await expect(page.locator('#hero-get-started-btn')).toBeVisible();
  });

  test('allows demo quick fill login and navigation', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Click demo quick fill
    await page.getByRole('button', { name: /user/i }).click();
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify redirected to Home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('#logout-btn')).toBeVisible();
  });

  test('allows registration form submission', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();

    await page.getByPlaceholder('John Doe').fill('Hackathon Hacker');
    await page.getByPlaceholder('name@example.com').fill(`hacker_${Date.now()}@example.com`);
    await page.getByPlaceholder('••••••••').fill('supersecret123');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL('/');
  });
});

