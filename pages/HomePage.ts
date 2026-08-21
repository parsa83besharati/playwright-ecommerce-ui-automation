import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly searchInput =
    '[data-testid="search-input"], input[name="search"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly searchButton =
    '[data-testid="search-button"], .search-button button[type="submit"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly cartBadge = '[data-testid="cart-badge"], .cart-item-total';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly cartIcon =
    '[data-testid="cart-icon"], a[data-toggle="mz-pure-drawer"]:has(.cart-icon)';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly logo = '[data-testid="logo"], #entry_217821 img';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly shopByCategory =
    '[data-testid="shop-by-category"], a[data-toggle="mz-pure-drawer"][href="#mz-component-1626147655"]';
  readonly descriptionCheckbox = '#description';
  readonly searchPageButton = '#button-search';
  readonly toast = '.toast';

  addToCartButton(productId: number): string {
    // TODO: data-testid not in site HTML — CSS fallback
    return `[data-testid="add-to-cart-${productId}"], button.cart-${productId}`;
  }

  categoryLink(pathId: number): string {
    // TODO: data-testid not in site HTML — CSS fallback
    return `[data-testid="category-link-${pathId}"], a[href*="path=${pathId}"]`;
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForVisible(this.logo);
  }

  async searchFor(term: string): Promise<void> {
    await this.fill(this.searchInput, term, 'Search input');
    await this.click(this.searchButton, 'Search button');
  }

  async addProductToCart(productId: number): Promise<void> {
    await this.click(this.addToCartButton(productId), `Add product ${productId} to cart`);
  }

  async openCartDrawer(): Promise<void> {
    await this.click(this.cartIcon, 'Cart icon');
    await this.waitForVisible('.widget-total');
  }

  async navigateToCategory(pathId: number): Promise<void> {
    await this.navigate(`/index.php?route=product/category&path=${pathId}`);
    await this.waitForUrl(`path=${pathId}`);
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }
}
