import loginData from '../../test-data/login.json';
import { test } from '../../src/fixtures/pom-fixtures';


test.use({
  baseURL: 'https://www.saucedemo.com',
  testIdAttribute: 'data-test',
  storageState: 'storage/auth.json'
});


test.describe('Cart smoke (order-independent)', () => {


test.beforeEach(async ({ loginPage, inventoryPage, disableAnims }) => {
  await loginPage.goto();
  await disableAnims?.();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.expectLoaded();
});


  test('add first 2 items then verify in cart', async ({ inventoryPage, cartPage }) => {
    const added = await inventoryPage.addFirstNProducts(2);
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemCount(added);
  });
});