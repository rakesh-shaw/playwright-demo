import { expect, Page } from '@playwright/test';

export class DocsPage {
  constructor(private readonly page: Page) {}

  h1 = () => this.page.getByRole('main').getByRole('heading', { level: 1 });

  async expectIntroH1() {
    await expect(this.h1()).toContainText(/(getting started|introduction|intro|installation)/i);
  }
}