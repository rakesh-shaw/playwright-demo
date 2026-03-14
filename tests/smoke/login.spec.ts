import { test, expect } from '@playwright/test';
import loginData from '../../test-data/login.json';

test.use({
  baseURL: loginData.baseUrl,
  testIdAttribute: 'data-test'
});

test.describe('Login smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    try {
      const openMenu = page.getByRole('button', { name: /open menu/i });
      if (await openMenu.isVisible()) {
        await openMenu.click();
        await page.getByRole('link', { name: /logout/i }).click();
        await expect(page).toHaveURL(/\/$/); 
      }
    } catch {}
  });

  test('valid login navigates to inventory', async ({ page }) => {
    await page.getByTestId('username').fill(loginData.valid.username);  
    await page.getByTestId('password').fill(loginData.valid.password);   
    await page.getByTestId('login-button').click();                      

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible();
  });

  test('invalid password shows an error message', async ({ page }) => {
    await page.getByTestId('username').fill(loginData.invalid.username);
    await page.getByTestId('password').fill(loginData.invalid.password);
    await page.getByTestId('login-button').click();

    const error = page.getByTestId('error');
    await expect(error).toBeVisible();
    await expect(error).toContainText(/username and password do not match|epic sadface/i);
  });

  test('locked out user cannot login', async ({ page }) => {
    await page.getByTestId('username').fill(loginData.locked.username);
    await page.getByTestId('password').fill(loginData.locked.password);
    await page.getByTestId('login-button').click();

    const error = page.getByTestId('error');
    await expect(error).toBeVisible();
    await expect(error).toContainText(/locked out/i);
  });
});