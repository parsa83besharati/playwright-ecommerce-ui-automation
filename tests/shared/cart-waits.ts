import type { HomePage } from '../../pages/HomePage';

/** Wait for add-to-cart toast to appear and dismiss. */
export async function waitForAddToCartToast(homePage: HomePage): Promise<void> {
  await homePage.waitForVisible('.toast', 5000);
  await homePage.waitForHidden('.toast', 5000);
}
