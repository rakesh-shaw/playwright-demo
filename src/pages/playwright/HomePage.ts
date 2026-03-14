import { expect, Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('https://playwright.dev'); // baseURL = https://playwright.dev
  }

  getStartedLink = () => this.page.getByRole('link', { name: /Get started/i });

  async expectTitle() {
    await expect(this.page).toHaveTitle(/Playwright/i);
    await expect(this.getStartedLink()).toBeVisible();
  }

  async clickGetStartedAndWait() {
    await Promise.all([
      this.page.waitForURL(/\/docs\/.*intro/i),
      this.getStartedLink().click()
    ]);
  }
}