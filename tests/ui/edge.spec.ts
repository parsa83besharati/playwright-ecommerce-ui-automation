import { test, expect } from '../../fixtures/fixtures';
import { ProductTemplates, edgeTenProductIds } from '../../data/templates/product-templates';
import { UserTemplates } from '../../data/templates/user-templates';
import { EdgeScenarios } from '../../data/scenarios/edge-scenarios';
import { waitForAddToCartToast } from '../shared/cart-waits';

const viewportPresets = ['desktop', 'tablet', 'mobile'] as const;

test.describe('Edge Cases Suite', { tag: ['@edge', '@responsive'] }, () => {
  test.beforeEach(async ({ clearCart, homePage }) => {
    await clearCart();
    await homePage.goto();
    await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
  });

  test('TC-EDGE-001 — Cart with ten different products', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    for (const id of edgeTenProductIds) {
      await productPage.goto(id);
      await expect(productPage.page.locator(productPage.addToCartButton)).toBeEnabled();
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);
    }
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(edgeTenProductIds.length);
  });

  test('TC-EDGE-002 — Maximum quantity on one product', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.setQuantity(100);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });

  test('TC-EDGE-003 — Register with max-length name', async ({ registerPage, page }) => {
    const user = UserTemplates.maxLengthName();
    await registerPage.goto();
    await registerPage.fillRegistration({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? '+1234567890',
      password: user.password ?? 'Password123!',
      agreePrivacy: true,
    });
    await registerPage.submit();
    await expect(page).toHaveURL(/account/);
  });

  for (const vp of viewportPresets) {
    test(`TC-EDGE-004 — Search with 500-character string [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor(EdgeScenarios.longSearch.searchTerm);
      await expect(categoryPage.page.locator('h1')).toBeVisible();
    });

    test(`TC-EDGE-005 — Search with single character [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor(EdgeScenarios.singleCharSearch.searchTerm);
      await expect(categoryPage.page).toHaveURL(/search/);
    });
  }

  test('TC-EDGE-006 — Price filter at exact boundary', async ({ homePage, categoryPage }) => {
    await homePage.goto();
    await homePage.navigateToCategory(25);
    await categoryPage.filterByExactPrice(
      EdgeScenarios.priceBoundary.min,
      EdgeScenarios.priceBoundary.max,
    );
    expect(await categoryPage.getProductCount()).toBeGreaterThan(0);
  });

  test('TC-EDGE-007 — Pagination last page with 25 per page', async ({
    homePage,
    categoryPage,
  }) => {
    await homePage.goto();
    await homePage.navigateToCategory(25);
    await categoryPage.showPerPage('25');
    await categoryPage.goToLastPage();
    await expect(categoryPage.page.locator(categoryPage.paginationText)).toContainText(
      'Showing 51 to 75 of 75',
    );
  });

  test('TC-EDGE-008 — Remove last item shows empty cart', async ({
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
    await cartPage.removeItem(key!);
    await expect(cartPage.page.locator(cartPage.emptyMessage)).toBeVisible();
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('TC-EDGE-009 — Rapid update and remove on different lines', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const p1 = ProductTemplates.iMac();
    const p2 = ProductTemplates.canonEOS();
    await productPage.goto(p1.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await productPage.goto(p2.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const key1 = await cartPage.getCartKeyForProduct(p1.id);
    const key2 = await cartPage.getCartKeyForProduct(p2.id);
    expect(key1).not.toBeNull();
    expect(key2).not.toBeNull();
    await cartPage.updateQuantity(key1!, 10);
    await cartPage.removeItem(key2!);
    await cartPage.waitForNetworkIdle();
    expect(await cartPage.getItemCount()).toBeGreaterThanOrEqual(1);
  });

  // Demo site has no product with intentionally missing metadata.
  // eslint-disable-next-line playwright/no-skipped-test -- no catalog item on demo store
  test.skip('TC-EDGE-010 — Product with missing metadata', async () => {
    // Not automatable on LambdaTest demo — no such catalog item exists.
  });

  test('TC-EDGE-011 — Back and forward after quantity change', async ({
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
    await cartPage.updateQuantity(key!, 5);
    await homePage.goBack();
    await homePage.goForward();
    await cartPage.waitForNetworkIdle();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });

  test('TC-EDGE-012 — Cart cleared after session cookies removed', async ({
    productPage,
    homePage,
    page,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    expect(await homePage.getCartBadgeCount()).toBe(1);
    await page.context().clearCookies();
    await page.reload();
    await homePage.goto();
    expect(await homePage.getCartBadgeCount()).toBe(0);
  });
});
