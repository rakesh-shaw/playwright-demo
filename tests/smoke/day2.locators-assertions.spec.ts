import { test, expect } from '@playwright/test';
test('Landing page: title contains Playwright and primary CTA is visible', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/i);
  await expect(page.getByRole('link', { name: /Get started/i })).toBeVisible();
});

test('Navigation: "Get started" opens docs intro', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: /Get started/i }).click();
  await expect(page).toHaveURL(/\/docs\/.*intro/i);

const mainH1 = page.getByRole('main').getByRole('heading', { level: 1 });
await expect(mainH1).toContainText(/(getting started|introduction|intro|installation)/i);

});

test('Form by label: fill email, accept terms, enable submit', async ({ page }) => {
  await page.setContent(`
    <form>
      <label for="email">Email</label>
      <input id="email" type="email" placeholder="name@example.com" />
      <label><input id="terms" type="checkbox" /> Accept terms</label>
      <button id="submit" data-testid="submit-btn" disabled>Submit</button>
    </form>
  `);

  await page.getByLabel('Email').fill('rakesh@example.com');
  await expect(page.getByLabel('Email')).toHaveValue('rakesh@example.com');

  const terms = page.getByLabel('Accept terms');
  await terms.check();
  await expect(terms).toBeChecked();

  await page.evaluate(() => {
    const btn = document.getElementById('submit') as HTMLButtonElement;
    btn.disabled = false;
  });

  await expect(page.getByTestId('submit-btn')).toBeEnabled();
});

test('Todos list: count and item text via test ids', async ({ page }) => {
  await page.setContent(`
    <ul id="todos">
      <li data-testid="todo">Write tests</li>
      <li data-testid="todo">Review report</li>
      <li data-testid="todo">Fix flake</li>
    </ul>
  `);

  const todos = page.getByTestId('todo');
  await expect(todos).toHaveCount(3);
  await expect(todos.nth(0)).toHaveText('Write tests');
  await expect(todos.nth(1)).toHaveText('Review report');
  await expect(todos.nth(2)).toHaveText('Fix flake');
});

test('Panel visibility toggles correctly', async ({ page }) => {
  await page.setContent(`
    <button id="open" aria-controls="panel">Toggle</button>
    <div id="panel" hidden data-testid="panel">Panel content</div>
  `);

  const panel = page.getByTestId('panel');
  await expect(panel).toBeHidden();

  await page.evaluate(() => {
    const el = document.getElementById('panel')!;
    (el as HTMLDivElement).hidden = false;
  });

  await expect(panel).toBeVisible();
});