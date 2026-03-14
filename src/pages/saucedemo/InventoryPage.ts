import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // High-level UI bits
  inventoryContainer = () => this.byTestId('inventory-container');
  menuButton = () => this.page.getByRole('button', { name: /open menu/i });
  logoutLink = () => this.page.getByRole('link', { name: /logout/i });
  cartLink = () => this.page.locator('#shopping_cart_container a'); // stable element for cart

  // Generic product add/remove locators (agnostic of specific product names)
  addToCartButtons = (): Locator => this.page.locator('[data-test^="add-to-cart"]');
  removeButtons = (): Locator => this.page.locator('[data-test^="remove"]');

  async addFirstNProducts(n: number) {
    const adds = this.addToCartButtons();
    const count = await adds.count();
    const toAdd = Math.min(n, count);
    for (let i = 0; i < toAdd; i++) {
      await adds.nth(i).click();
    }
    return toAdd;
  }

  async openCart() {
    await this.cartLink().click();
  }

  async logoutIfPossible() {
    if (await this.menuButton().isVisible()) {
      await this.menuButton().click();
      await this.logoutLink().click();
    }
  }
  
  async expectLoaded(): Promise<void> {
    const url = this.page.url();
    if (url === 'about:blank' || url.endsWith('/') || url.endsWith('/index.html')) {
      await this.page.goto('/inventory.html', { waitUntil: 'domcontentloaded' });
    }
    await this.expectUrl(/inventory\.html/);
    await expect(this.inventoryContainer()).toBeVisible();
    await expect(this.menuButton()).toBeVisible();
  }

}