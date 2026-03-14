import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('shows Playwright in the title and CTA is visible', async ({ page }) => {
    await page.goto('https://playwright.dev');

    await expect(page).toHaveTitle(/Playwright/);

    await expect(page.getByRole('link', { name: /Get started/i })).toBeVisible();
  });
});