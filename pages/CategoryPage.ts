import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly pageTitle = '[data-testid="category-title"], h1';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly productCards = '[data-testid="product-cards"], .product-thumb';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly sortDropdown = '[data-testid="sort-dropdown"], select[id^="input-sort"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly showDropdown = '[data-testid="show-dropdown"], select[id^="input-limit"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly paginationText = '[data-testid="pagination-text"], .col-sm-6.text-right';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly gridViewBtn = '[data-testid="grid-view-btn"], #grid-view';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly listViewBtn = '[data-testid="list-view-btn"], #list-view';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly productPrices = '[data-testid="product-price"], .price-new';
  readonly priceMinInput = 'input[name="mz_fp[min]"]';
  readonly priceMaxInput = 'input[name="mz_fp[max]"]';
  readonly lastPageLink = 'a.page-link:has-text(">|")';
  readonly noResultsMessage = 'p:has-text("There is no product that matches")';

  manufacturerCheckbox(manufacturerId: number): string {
    // TODO: data-testid not in site HTML — CSS fallback
    return `[data-testid="manufacturer-${manufacturerId}"], input[id$="-${manufacturerId}"]`;
  }

  availabilityCheckbox(stockValue: string): string {
    // TODO: data-testid not in site HTML — CSS fallback
    return `[data-testid="availability-${stockValue}"], input[id$="-${stockValue}"]`;
  }

  addToCartButton(productId: number): string {
    // TODO: data-testid not in site HTML — CSS fallback
    return `[data-testid="add-to-cart-${productId}"], button.cart-${productId}`;
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(categoryPath: number): Promise<void> {
    await this.navigate(`/index.php?route=product/category&path=${categoryPath}`);
    await this.waitForVisible(this.productCards);
  }

  async getPageTitle(): Promise<string> {
    return this.getText(this.pageTitle);
  }

  async getProductCount(): Promise<number> {
    return this.getCount(this.productCards);
  }

  async getDisplayedProductNames(): Promise<string[]> {
    const names = await this.page.locator('.product-thumb .title a').allTextContents();
    return names.map((n) => n.trim());
  }

  async applyManufacturerFilter(manufacturerId: number): Promise<void> {
    await this.check(this.manufacturerCheckbox(manufacturerId), `Manufacturer ${manufacturerId}`);
    await this.waitForNetworkIdle();
  }

  async applyAvailabilityFilter(stockValue: string): Promise<void> {
    await this.check(this.availabilityCheckbox(stockValue), `Availability ${stockValue}`);
    await this.waitForNetworkIdle();
  }

  async addProductToCart(productId: number): Promise<void> {
    await this.click(this.addToCartButton(productId), `Add product ${productId} from category`);
  }

  async sortBy(label: string): Promise<void> {
    await this.selectOption(this.sortDropdown, label);
    await this.waitForNetworkIdle();
  }

  async showPerPage(label: string): Promise<void> {
    await this.selectOption(this.showDropdown, label);
    await this.waitForNetworkIdle();
  }

  async switchToGridView(): Promise<void> {
    await this.click(this.gridViewBtn, 'Grid view');
    await this.waitForNetworkIdle();
  }

  async switchToListView(): Promise<void> {
    await this.click(this.listViewBtn, 'List view');
    await this.waitForNetworkIdle();
  }

  async clearAllFilters(): Promise<void> {
    const clearAllButton = this.page.locator('[data-mz-reset="all"]');
    await clearAllButton.waitFor({ state: 'visible', timeout: 10_000 });
    await clearAllButton.click();
    await this.waitForNetworkIdle();
  }

  async filterByExactPrice(min: number, max: number): Promise<void> {
    await this.fill(this.priceMinInput, min.toString(), 'Price min');
    await this.fill(this.priceMaxInput, max.toString(), 'Price max');
    await this.pressKey(this.priceMaxInput, 'Enter');
    await this.waitForNetworkIdle();
  }

  async goToLastPage(): Promise<void> {
    await this.click(this.lastPageLink, 'Last pagination page');
    await this.waitForNetworkIdle();
  }
}
