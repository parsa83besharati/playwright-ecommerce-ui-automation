import { test, expect } from '../../fixtures/fixtures';
import { ProductTemplates } from '../../data/templates/product-templates';
import { ShippingTemplates } from '../../data/templates/shipping-templates';
import { NegativeTemplates } from '../../data/templates/negative-templates';
import { waitForAddToCartToast } from '../shared/cart-waits';

const viewportPresets = ['desktop', 'tablet', 'mobile'] as const;

test.describe('Regression Suite', { tag: ['@regression', '@responsive'] }, () => {
  test.beforeEach(async ({ clearCart, homePage }) => {
    await clearCart();
    await homePage.goto();
    await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
  });

  for (const vp of viewportPresets) {
    test(`TC-REG-001 — Homepage loads with key elements [${vp}]`, async ({
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await expect(homePage.page.locator(homePage.logo)).toBeVisible();
      await expect(homePage.page.locator(homePage.searchInput)).toBeVisible();
      await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
    });

    test(`TC-REG-002 — Search returns results [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor('palm');
      await expect(categoryPage.page).toHaveURL(/search/);
      expect(await categoryPage.getProductCount()).toBeGreaterThanOrEqual(2);
    });

    test(`TC-REG-003 — Search with description filter [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigate('/index.php?route=product/search');
      await homePage.fill(homePage.searchInput, 'palm');
      await homePage.check(homePage.descriptionCheckbox);
      await homePage.click(homePage.searchPageButton);
      await expect(categoryPage.page).toHaveURL(/search/);
      expect(await categoryPage.getProductCount()).toBeGreaterThanOrEqual(2);
    });

    test(`TC-REG-004 — Search with no matches [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor('ipad');
      await expect(categoryPage.page.locator(categoryPage.noResultsMessage)).toBeVisible();
    });

    test(`TC-REG-005 — Category browse and pagination [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await expect(categoryPage.page.locator(categoryPage.pageTitle)).toHaveText('Components');
      await expect(categoryPage.page.locator(categoryPage.paginationText)).toContainText(
        'Showing 1 to 15 of 75 (5 Pages)',
      );
    });

    test(`TC-REG-006 — Manufacturer filter [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.applyManufacturerFilter(8);
      expect((await categoryPage.getDisplayedProductNames()).length).toBeGreaterThan(0);
    });

    test(`TC-REG-007 — Availability filter [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.applyAvailabilityFilter('-1');
      expect(await categoryPage.getProductCount()).toBeGreaterThan(0);
      await categoryPage.clearAllFilters();
      await categoryPage.applyAvailabilityFilter('5');
      expect(await categoryPage.getProductCount()).toBeGreaterThan(0);
    });

    test(`TC-REG-008 — Grid view toggle [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.switchToGridView();
      await expect(categoryPage.page.locator(categoryPage.gridViewBtn)).toBeVisible();
    });

    test(`TC-REG-009 — List view toggle [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.switchToListView();
      await expect(categoryPage.page.locator(categoryPage.listViewBtn)).toBeVisible();
    });

    test(`TC-REG-010 — Combined filters [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.applyManufacturerFilter(8);
      await categoryPage.applyAvailabilityFilter('-1');
      expect((await categoryPage.getDisplayedProductNames()).length).toBeGreaterThan(0);
    });

    test(`TC-REG-011 — Sort by price low to high [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.sortBy('Price (Low > High)');
      const prices = await categoryPage.page.locator(categoryPage.productPrices).allTextContents();
      const nums = prices.map((p) => parseFloat(p.replace('$', '')));
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]);
      }
    });

    test(`TC-REG-012 — Show 25 items per page [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.navigateToCategory(25);
      await categoryPage.showPerPage('25');
      await expect(categoryPage.page.locator(categoryPage.paginationText)).toContainText(
        'Showing 1 to 25',
      );
    });

    test(`TC-REG-013 — Product detail required fields [${vp}]`, async ({
      productPage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await expect(productPage.page.locator(productPage.productName)).toHaveText(product.name);
      await expect(productPage.page.locator(productPage.productPrice)).toHaveText(
        `$${product.price.toFixed(2)}`,
      );
      await expect(productPage.page.locator(productPage.addToCartButton)).toBeVisible();
    });

    test(`TC-REG-014 — Add to cart from homepage [${vp}]`, async ({ homePage, setViewport }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await homePage.goto();
      await homePage.addProductToCart(product.id);
      await waitForAddToCartToast(homePage);
      expect(await homePage.getCartBadgeCount()).toBe(1);
    });

    test(`TC-REG-015 — Add to cart from category [${vp}]`, async ({
      categoryPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await categoryPage.goto(product.categoryPath);
      await categoryPage.addProductToCart(product.id);
      await waitForAddToCartToast(homePage);
      expect(await homePage.getCartBadgeCount()).toBe(1);
    });

    test(`TC-REG-016 — Add to cart from product detail [${vp}]`, async ({
      productPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);
      expect(await homePage.getCartBadgeCount()).toBe(1);
    });

    test(`TC-REG-017 — Out-of-stock product blocked [${vp}]`, async ({
      productPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iPodTouch();
      await productPage.goto(product.id);
      await expect(productPage.page.locator(productPage.addToCartButton)).toBeDisabled();
      await homePage.goto();
      expect(await homePage.getCartBadgeCount()).toBe(0);
    });

    test(`TC-REG-018 — Increase quantity in cart [${vp}]`, async ({
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
      expect(await cartPage.getSubTotal()).toBe(product.price * 3);
    });

    test(`TC-REG-019 — Decrease quantity in cart [${vp}]`, async ({
      productPage,
      cartPage,
      homePage,
      setViewport,
    }) => {
      await setViewport(vp);
      const product = ProductTemplates.iMac();
      await productPage.goto(product.id);
      await productPage.setQuantity(3);
      await productPage.addToCart();
      await waitForAddToCartToast(homePage);
      await cartPage.goto();
      const key = await cartPage.getCartKeyForProduct(product.id);
      expect(key).not.toBeNull();
      await cartPage.updateQuantity(key!, 2);
      expect(await cartPage.getSubTotal()).toBe(product.price * 2);
    });

    test(`TC-REG-020 — Remove product from cart [${vp}]`, async ({
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

    test(`TC-REG-021 — Cart persists across navigation [${vp}]`, async ({
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
      expect(await homePage.getCartBadgeCount()).toBe(1);
      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(1);
    });
  }

  test('TC-REG-022 — Cart pricing decision table', async ({
    productPage,
    cartPage,
    homePage,
    clearCart,
  }) => {
    const cases = [
      { ids: [41], qtys: [1], subTotal: 170.0, total: 206.0 },
      { ids: [30, 29], qtys: [1, 1], subTotal: 471.99, total: 570.39 },
      { ids: [41, 30, 29], qtys: [3, 1, 1], subTotal: 981.99, total: 1188.39 },
    ];
    for (const c of cases) {
      await clearCart();
      await homePage.goto();
      for (let i = 0; i < c.ids.length; i++) {
        await productPage.goto(c.ids[i]);
        await productPage.setQuantity(c.qtys[i]);
        await productPage.addToCart();
        await waitForAddToCartToast(homePage);
      }
      await cartPage.goto();
      expect(await cartPage.getSubTotal()).toBe(c.subTotal);
      expect(await cartPage.getTotal()).toBe(c.total);
    }
  });

  test('TC-REG-023 — Apply invalid coupon code', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    await cartPage.applyCoupon(NegativeTemplates.invalidCoupon());
    await expect(cartPage.page.locator(cartPage.alertDanger)).toContainText(
      'Coupon is either invalid',
    );
  });

  test('TC-REG-024 — Estimate shipping with valid address', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const shipping = ShippingTemplates.ukLondon();
    await cartPage.estimateShipping(
      shipping.countryId.toString(),
      shipping.regionId.toString(),
      shipping.postcode,
    );
    await expect(cartPage.page.locator(cartPage.shippingModal)).toBeVisible();
  });
});
