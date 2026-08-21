import { test as base } from '@playwright/test';
import { getBaseUrl } from '../config/env';
import { logger } from '../utils/logger';
import { logNavigation } from '../utils/navigation-logger';
import { setupTestLogger, teardownTestLogger } from '../utils/logger-helpers';
import { dataRegistry } from '../data/registry/data-registry';

import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

// ==================== VIEWPORT TYPES ====================

export type ViewportPreset = 'desktop' | 'tablet' | 'mobile';

export const viewports: Record<ViewportPreset, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 1024, height: 768 },
  mobile: { width: 390, height: 844 },
};

// ==================== ALL FIXTURES ====================

type MyFixtures = {
  setViewport: (preset: ViewportPreset) => Promise<void>;
  clearCart: () => Promise<void>;
  homePage: HomePage;
  categoryPage: CategoryPage;
  productPage: ProductDetailPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = base.extend<MyFixtures>({
  // Logger fixture – runs automatically for every test
  page: async ({ page, baseURL }, use, testInfo) => {
    setupTestLogger(testInfo);
    const envBase = getBaseUrl();
    logNavigation(
      `BASE_URL=${envBase} | Playwright baseURL=${baseURL ?? '(none)'} | match=${baseURL === envBase}`,
    );
    await use(page);
    await teardownTestLogger(testInfo);
  },

  // Viewport fixture – call it inside a test to change resolution
  setViewport: async ({ page }, use) => {
    await use(async (preset: ViewportPreset) => {
      const { width, height } = viewports[preset];
      await page.setViewportSize({ width, height });
    });
  },

  // Reset session only — first real navigation is homePage.goto() in beforeEach
  clearCart: async ({ page }, use) => {
    await use(async () => {
      await page.context().clearCookies();
      logNavigation(`clearCart: cookies cleared for ${getBaseUrl()}`);
    });
  },

  // Page Object fixtures – injected automatically
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

test.afterEach(() => {
  dataRegistry.clear();
});

export { expect } from '@playwright/test';
