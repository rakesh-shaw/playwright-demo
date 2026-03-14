import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartItems = (): Locator => this.page.locator('.cart_item'); // stable class on saucedemo
  continueShopping = () => this.byTestId('continue-shopping');

  async expectLoaded() {
    await this.expectUrl(/cart\.html/);
    await expect(this.continueShopping()).toBeVisible();
  }

  async expectItemCount(n: number) {
    await expect(this.cartItems()).toHaveCount(n);
  }
}