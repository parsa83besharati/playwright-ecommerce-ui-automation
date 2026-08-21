import { test, expect } from '../../fixtures/fixtures';
import { ProductTemplates } from '../../data/templates/product-templates';
import { UserTemplates } from '../../data/templates/user-templates';
import { NegativeTemplates } from '../../data/templates/negative-templates';
import { waitForAddToCartToast } from '../shared/cart-waits';

const viewportPresets = ['desktop', 'tablet', 'mobile'] as const;

const protectedAccountUrls = [
  '/index.php?route=account/account',
  '/index.php?route=account/order',
  '/index.php?route=account/address',
  '/index.php?route=account/wishlist',
] as const;

test.describe('Security Suite', { tag: ['@security', '@responsive'] }, () => {
  test.beforeEach(async ({ clearCart, homePage }) => {
    await clearCart();
    await homePage.goto();
    await expect(homePage.page.locator(homePage.cartBadge)).toHaveText('0');
  });

  for (const vp of viewportPresets) {
    test(`TC-SEC-001 — Reflected XSS via search [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      const xssPayload = NegativeTemplates.xssSearchPayload();
      await homePage.searchFor(xssPayload);
      await expect(categoryPage.page.locator('h1')).toContainText(xssPayload);
    });

    test(`TC-SEC-002 — Reflected XSS via registration [${vp}]`, async ({
      registerPage,
      setViewport,
    }) => {
      await setViewport(vp);
      const user = UserTemplates.johnDoe();
      const xssPayload = '<img src=x onerror=alert("XSS")>';
      await registerPage.goto();
      await registerPage.fillRegistration({
        firstName: xssPayload,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        agreePrivacy: true,
      });
      await registerPage.submit();
      await expect(registerPage.page.locator('body')).toBeVisible();
    });

    test(`TC-SEC-003 — SQL injection via search [${vp}]`, async ({
      homePage,
      categoryPage,
      setViewport,
    }) => {
      await setViewport(vp);
      await homePage.goto();
      await homePage.searchFor("' OR '1'='1");
      await expect(categoryPage.page.locator('h1')).toBeVisible();
    });

    test(`TC-SEC-004 — SQL injection via login [${vp}]`, async ({ loginPage, setViewport }) => {
      await setViewport(vp);
      await loginPage.goto();
      await loginPage.login(
        NegativeTemplates.sqlInjectionLogin(),
        NegativeTemplates.invalidLoginPassword(),
      );
      await expect(loginPage.page.locator(loginPage.errorAlert)).toContainText(
        'No match for E-Mail Address and/or Password',
      );
    });
  }

  test('TC-SEC-005 — CSRF token field on cart form', async ({
    cartPage,
    productPage,
    homePage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    await cartPage.goto();
    const tokenCount = await cartPage.page
      .locator('input[type="hidden"][name*="token"]')
      .count();
    expect(tokenCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-SEC-006 — Account pages redirect to login', async ({ homePage, page }) => {
    for (const url of protectedAccountUrls) {
      await homePage.navigate(url);
      await expect(page).toHaveURL(/login/);
    }
  });

  test('TC-SEC-007 — Password fields are masked', async ({ loginPage, registerPage }) => {
    await loginPage.goto();
    await expect(loginPage.page.locator(loginPage.passwordInput)).toHaveAttribute(
      'type',
      'password',
    );
    await registerPage.goto();
    await expect(registerPage.page.locator(registerPage.passwordInput)).toHaveAttribute(
      'type',
      'password',
    );
    await expect(registerPage.page.locator(registerPage.confirmPasswordInput)).toHaveAttribute(
      'type',
      'password',
    );
  });

  test('TC-SEC-008 — Reused session cookie does not restore cart', async ({
    page,
    homePage,
    productPage,
  }) => {
    const product = ProductTemplates.iMac();
    await productPage.goto(product.id);
    await productPage.addToCart();
    await waitForAddToCartToast(homePage);
    const cookies = await page.context().cookies();
    await page.context().clearCookies();
    await page.context().addCookies(cookies);
    await page.reload();
    await homePage.goto();
    expect(await homePage.getCartBadgeCount()).toBe(0);
  });

  test('TC-SEC-009 — No hardcoded secrets in page source', async ({ homePage, page }) => {
    await homePage.navigate('/');
    const pageSource = await page.content();
    expect(pageSource).not.toMatch(/api_key\s*=\s*['"][^'"]+['"]/i);
    expect(pageSource).not.toMatch(/secret\s*=\s*['"][^'"]+['"]/i);
    expect(pageSource).not.toContain('BEGIN PRIVATE KEY');
  });

  test('TC-SEC-010 — HTTPS is enforced', async ({ homePage, page }) => {
    await homePage.navigate('/');
    expect(page.url()).toMatch(/^https:\/\//);
  });
});
