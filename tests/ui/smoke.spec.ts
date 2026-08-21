import { test, expect } from '../../fixtures/fixtures';
import { ProductTemplates } from '../../data/templates/product-templates';
import { waitForAddToCartToast } from '../shared/cart-waits';

const viewportPresets = ['desktop', 'tablet', 'mobile'] as const;

test.describe('Smoke Suite', { tag: ['@smoke', '@responsive'] }, () => {
  test.beforeEach(async ({ clearCart, homePage }) => {
    await clearCart();
    await homePage.goto();
    await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
  });

  for (const vp of viewportPresets) {
    test(`TC-SMOKE-001 — Homepage loads [${vp}]`, async ({ homePage, setViewport }) => {
      await setViewport(vp);
      await homePage.goto();
      await expect(homePage.page.locator(homePage.logo)).toBeVisible();
      await expect(homePage.page.locator(homePage.searchInput)).toBeVisible();
    });

    test(`TC-SMOKE-002 — Search for a product [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor('palm');
      await expect(categoryPage.page).toHaveURL(/search/);
      const count = await categoryPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test(`TC-SMOKE-003 — Browse category and filter [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await expect(categoryPage.page.locator(categoryPage.pageTitle)).toHaveText('Components');
      await categoryPage.applyManufacturerFilter(8);
      const names = await categoryPage.getDisplayedProductNames();
      expect(names.length).toBeGreaterThan(0);
    });

    test(`TC-SMOKE-004 — Product detail page [${vp}]`, async ({ productPage, setViewport }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await expect(productPage.page.locator(productPage.productName)).toHaveText(product.name);
      await expect(productPage.page.locator(productPage.productPrice)).toHaveText(
        `$${product.price.toFixed(2)}`,
      );
      await expect(productPage.page.locator(productPage.addToCartButton)).toBeEnabled();
    });

    test(`TC-SMOKE-005 — Add to cart from homepage [${vp}]`, async ({
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await homePage.goto();
      await homePage.addProductToCart(product.id);
      await waitForAddToCartToast(homePage);
      await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('1');
    });

    test(`TC-SMOKE-006 — Add to cart from product detail [${vp}]`, async ({
      productPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);
      await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('1');
    });

    test(`TC-SMOKE-007 — Add to cart from category page [${vp}]`, async ({
      categoryPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await categoryPage.goto(product.categoryPath);
      await categoryPage.addProductToCart(product.id);
      await waitForAddToCartToast(homePage);
      await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('1');
    });

    test(`TC-SMOKE-008 — Increase quantity and verify totals [${vp}]`, async ({
      productPage,
      cartPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);

      await cartPage.goto();
      const key = await cartPage.getCartKeyForProduct(product.id);
      expect(key).not.toBeNull();
      await cartPage.updateQuantity(key!, 3);

      const expectedSubTotal = product.price * 3;
      const expectedEcoTax = 3 * 2;
      const expectedVat = parseFloat((expectedSubTotal * 0.2).toFixed(2));
      const expectedTotal = expectedSubTotal + expectedEcoTax + expectedVat;

      expect(await cartPage.getSubTotal()).toBe(expectedSubTotal);
      expect(await cartPage.getTotal()).toBe(expectedTotal);
    });

    test(`TC-SMOKE-009 — Remove product from cart [${vp}]`, async ({
      productPage,
      cartPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const p1 = ProductTemplates.iMac();
      const p2 = ProductTemplates.canonEOS();

      await productPage.goto(p1.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);

      await productPage.goto(p2.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);

      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(2);

      const key = await cartPage.getCartKeyForProduct(p1.id);
      expect(key).not.toBeNull();
      await cartPage.removeItem(key!);
      expect(await cartPage.getItemCount()).toBe(1);
    });

    test(`TC-SMOKE-010 — Cart persists across navigation [${vp}]`, async ({
      productPage,
      homePage,
      categoryPage,
      cartPage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);

      await homePage.goto();
      expect(await homePage.getCartBadgeCount()).toBe(1);

      await categoryPage.goto(product.categoryPath);
      await homePage.openCartDrawer();
      await expect(homePage.page.locator('.widget-total')).toContainText(product.name);

      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(1);
    });
  }
});
