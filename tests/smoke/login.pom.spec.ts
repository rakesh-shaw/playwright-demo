import loginData from '../../test-data/login.json';
import { test, expect } from '../../src/fixtures/pom-fixtures';

// Suite-specific defaults for saucedemo
test.use({
  baseURL: loginData.baseUrl,         // https://www.saucedemo.com
  testIdAttribute: 'data-test'
});

test.describe('Login smoke (POM)', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.disableAnimations(); // optional guard
  });

  test.afterEach(async ({ inventoryPage }) => {
    await inventoryPage.logoutIfPossible();
  });

  test('valid login navigates to inventory (AAA)', async ({ loginPage, inventoryPage }) => {
    // Arrange: on login page by beforeEach

    // Act:
    await loginPage.login(loginData.valid.username, loginData.valid.password);

    // Assert:
    await inventoryPage.expectLoaded();
  });

  test('invalid password shows an error (AAA)', async ({ loginPage }) => {
    // Arrange: on login page

    // Act:
    await loginPage.login(loginData.invalid.username, loginData.invalid.password);

    // Assert:
    await loginPage.expectError(/username and password do not match|epic sadface/i);
  });

  test('locked out user sees locked message (AAA)', async ({ loginPage }) => {
    // Act:
    await loginPage.login(loginData.locked.username, loginData.locked.password);

    // Assert:
    await loginPage.expectError(/locked out/i);
  });
});

test('add first 2 items then verify in cart (AAA)', async ({ loginPage, inventoryPage, cartPage }) => {
  // Arrange
  await loginPage.goto();
  await loginPage.login(loginData.valid.username, loginData.valid.password);
  await inventoryPage.expectLoaded();

  // Act
  const added = await inventoryPage.addFirstNProducts(2);
  await inventoryPage.openCart();

  // Assert
  await cartPage.expectLoaded();
  await cartPage.expectItemCount(added);
});