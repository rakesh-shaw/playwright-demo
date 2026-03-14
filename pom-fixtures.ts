import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/saucedemo/LoginPage';
import { InventoryPage } from '../pages/saucedemo/InventoryPage';
import { CartPage } from '../pages/saucedemo/CartPage';
import { HomePage } from '../pages/playwright/HomePage';
import { DocsPage } from '../pages/playwright/DocsPage';

async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{transition:none!important;animation:none!important}`
  });
}

type PomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  homePage: HomePage;
  docsPage: DocsPage;
  resetAppState: () => Promise<void>;
  disableAnims: () => Promise<void>;
};

export const test = base.extend<PomFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  docsPage: async ({ page }, use) => { await use(new DocsPage(page)); },

  disableAnims: async ({ page }, use) => {
    await use(async () => { await disableAnimations(page); });
  },

  resetAppState: async ({ page }, use) => {
    await use(async () => {
      // Works only if logged-in and the left menu is available
      try {
        const openMenu = page.getByRole('button', { name: /open menu/i });
        if (await openMenu.isVisible()) {
          await openMenu.click();
          // Saucedemo has a reset action in the sidebar
          const reset = page.getByRole('button', { name: /reset app state/i }).or(page.getByRole('link', { name: /reset app state/i }));
          if (await reset.isVisible()) {
            await reset.click();
          }
          // Close menu if needed
          const closeMenu = page.getByRole('button', { name: /close menu/i });
          if (await closeMenu.isVisible()) await closeMenu.click();
        }
      } catch {
        // ignore if menu not present; keep idempotent
      }
    });
  }
});

export { expect };
``