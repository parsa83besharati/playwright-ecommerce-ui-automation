import { test, expect } from '../../fixtures/fixtures';
import { ProductTemplates } from '../../data/templates/product-templates';
import { UserTemplates } from '../../data/templates/user-templates';
import { NegativeTemplates } from '../../data/templates/negative-templates';
import { NegativeScenarios } from '../../data/scenarios/negative-scenarios';
import { waitForAddToCartToast } from '../shared/cart-waits';

test.describe('Negative Suite', { tag: '@negative' }, () => {
  test.beforeEach(async ({ clearCart, homePage }) => {
    await clearCart();
    await homePage.goto();
    await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
  });

  test('TC-NEG-001 — Out-of-stock add button is disabled on PDP', async ({ productPage }) => {
    const product = NegativeScenarios.outOfStockProductUI.product;
    await productPage.goto(product.id);
    await expect(productPage.page.locator(productPage.addToCartButton)).toBeDisabled();
    await expect(productPage.page.locator(productPage.availabilityBadge)).toContainText(
      'Out Of Stock',
    );
  });

  test('TC-NEG-002 — Out-of-stock product cannot be added via cart.add', async ({
    productPage,
    homePage,
  }) => {
    await productPage.goto(NegativeScenarios.outOfStockProductJS.productId);
    await productPage.page.evaluate(() => {
      // OpenCart global — only valid when calling cart.add via evaluate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).cart.add('32');
    });
    await homePage.goto();
    expect(await homePage.getCartBadgeCount()).toBe(0);
  });

  test('TC-NEG-003 — Negative quantity rejected in cart', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const key = await cartPage.getCartKeyForProduct(product.id);
    expect(key).not.toBeNull();
    const subTotalBefore = await cartPage.getSubTotal();
    await cartPage.updateQuantity(key!, NegativeScenarios.negativeQuantity.invalidQuantity);
    expect(await cartPage.getSubTotal()).toBe(subTotalBefore);
  });

  test('TC-NEG-004 — Zero quantity rejected in cart', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const key = await cartPage.getCartKeyForProduct(product.id);
    expect(key).not.toBeNull();
    await cartPage.updateQuantity(key!, NegativeScenarios.zeroQuantity.invalidQuantity);
    await expect(cartPage.page.locator(cartPage.emptyMessage)).toBeVisible();
  });

  test('TC-NEG-005 — Non-numeric quantity rejected in cart', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const key = await cartPage.getCartKeyForProduct(product.id);
    expect(key).not.toBeNull();
    const inputSelector = `input[name="quantity[${key!}]"]`;
    await cartPage.fill(inputSelector, String(NegativeScenarios.textQuantity.invalidQuantity));
    const subTotalBefore = await cartPage.getSubTotal();
    await cartPage.page.locator(inputSelector).locator('..').locator('button[title="Update"]').click();
    await cartPage.waitForNetworkIdle();
    expect(await cartPage.getSubTotal()).toBe(subTotalBefore);
  });

  test('TC-NEG-006 — Extreme quantity does not break cart', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.setQuantity(NegativeScenarios.largeQuantity.invalidQuantity);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });

  test('TC-NEG-007 — Empty search shows validation or no-results state', async ({
    homePage,
    categoryPage,
  }) => {
    await homePage.goto();
    await homePage.searchFor(NegativeScenarios.emptySearch.searchTerm);
    await expect(categoryPage.page.locator('h1')).toBeVisible();
  });

  test('TC-NEG-008 — XSS payload in search is escaped', async ({
    homePage,
    categoryPage,
  }) => {
    await homePage.goto();
    const payload = NegativeScenarios.xssSearch.searchTerm;
    await homePage.searchFor(payload);
    await expect(categoryPage.page.locator('h1')).toContainText(payload);
  });

  test('TC-NEG-009 — Empty registration form shows field errors', async ({ registerPage }) => {
    const empty = UserTemplates.emptyFields();
    await registerPage.goto();
    await registerPage.fillRegistration({
      firstName: empty.firstName ?? '',
      lastName: empty.lastName ?? '',
      email: empty.email ?? '',
      phone: empty.phone ?? '',
      password: empty.password ?? '',
      agreePrivacy: false,
    });
    await registerPage.submit();
    await expect(registerPage.page.locator(registerPage.fieldError)).toHaveCount(5);
  });

  test('TC-NEG-010 — Duplicate email registration rejected', async ({ registerPage }) => {
    const user = UserTemplates.johnDoe();
    await registerPage.goto();
    await registerPage.fillRegistration({
      firstName: user.firstName,
      lastName: user.lastName,
      email: NegativeTemplates.duplicateEmail(),
      phone: user.phone,
      password: user.password,
      agreePrivacy: true,
    });
    await registerPage.submit();
    await expect(registerPage.page.locator(registerPage.errorAlert)).toBeVisible();
  });

  test('TC-NEG-011 — Invalid login credentials show error', async ({ loginPage }) => {
    const creds = NegativeScenarios.invalidLogin;
    await loginPage.goto();
    await loginPage.login(creds.email, creds.password);
    await expect(loginPage.page.locator(loginPage.errorAlert)).toContainText(
      'No match for E-Mail Address and/or Password',
    );
  });

  test('TC-NEG-012 — Empty login fields show validation', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.click(loginPage.loginButton, 'Login button');
    await expect(loginPage.page.locator(loginPage.errorAlert)).toBeVisible();
  });

  test('TC-NEG-013 — Empty coupon code shows warning', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    await cartPage.applyCoupon(NegativeTemplates.emptyCoupon());
    await expect(cartPage.page.locator(cartPage.alertDanger)).toBeVisible();
  });

  test('TC-NEG-014 — Empty gift certificate shows warning', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    await cartPage.applyGiftCertificate(NegativeTemplates.emptyGiftCertificate());
    await expect(cartPage.page.locator(cartPage.alertDanger)).toBeVisible();
  });

  test('TC-NEG-015 — Invalid shipping postcode rejected', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const shipping = NegativeScenarios.invalidShippingPostcode.shippingDetails;
    await cartPage.estimateShipping(
      shipping.countryId.toString(),
      shipping.regionId.toString(),
      shipping.postcode,
    );
    await expect(cartPage.page.locator(cartPage.alertDanger)).toBeVisible();
  });

  test('TC-NEG-016 — Checkout without items redirects to cart', async ({
    homePage,
    page,
  }) => {
    await homePage.navigate(NegativeScenarios.directCheckoutAccess.url);
    await expect(page).toHaveURL(/checkout\/cart|route=checkout\/cart/);
  });

  test('TC-NEG-017 — Invalid product URL returns not found', async ({ homePage }) => {
    const response = await homePage.navigate(NegativeTemplates.notFoundUrl());
    expect(response?.status()).toBe(404);
  });

  test('TC-NEG-018 — Rapid add-to-cart clicks yield single item', async ({
    productPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    const addButton = productPage.page.locator(productPage.addToCartButton);
    await addButton.dblclick();
    await waitForAddToCartToast(homePage);
    expect(await homePage.getCartBadgeCount()).toBe(1);
  });
});
