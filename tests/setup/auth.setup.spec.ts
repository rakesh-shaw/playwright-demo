import { test, expect } from '@playwright/test';
import fs from 'fs';
import loginData from '../../test-data/login.json';

test.use({
  baseURL: loginData.baseUrl,
  testIdAttribute: 'data-test'
});

test('authenticate and save storageState', async ({ page, context }) => {
  fs.mkdirSync('storage', { recursive: true });

  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByTestId('username').fill(loginData.valid.username);
  await page.getByTestId('password').fill(loginData.valid.password);
  await Promise.all([
    page.waitForURL(/inventory\.html/),
    page.getByTestId('login-button').click()
  ]);

  await context.storageState({ path: 'storage/auth.json' });
});