import { Page, expect, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path: string = '/') {
    await this.page.goto(path);
  }

  // Common assertion helpers
  async expectUrl(re: RegExp) {
    await expect(this.page).toHaveURL(re);
  }

  // Utilities around test id
  byTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  // Sometimes useful to disable animations for stability
  async disableAnimations() {
    await this.page.addStyleTag({
      content: `*,*::before,*::after{transition:none!important;animation:none!important}`
    });
  }
}