import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly productName = '[data-testid="product-name"], h1';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly productPrice = '[data-testid="product-price"], .price-new';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly addToCartButton = '[data-testid="add-to-cart-btn"], button.button-cart';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly buyNowButton = '[data-testid="buy-now-btn"], button.button-buynow';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly quantityInput = '[data-testid="quantity-input"], input[name="quantity"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly availabilityBadge = '[data-testid="availability-badge"], .badge-danger';

  constructor(page: Page) {
    super(page);
  }

  async goto(productId: number): Promise<void> {
    await this.navigate(`/index.php?route=product/product&product_id=${productId}`);
    await this.waitForVisible(this.productName);
  }

  async getProductName(): Promise<string> {
    return this.getText(this.productName);
  }

  async getProductPrice(): Promise<number> {
    const text = await this.getText(this.productPrice);
    return parseFloat(text.replace('$', ''));
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return this.isEnabled(this.addToCartButton);
  }

  async isOutOfStock(): Promise<boolean> {
    const badge = await this.getText(this.availabilityBadge);
    return badge.includes('Out Of Stock');
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton, 'Add to Cart');
  }

  async setQuantity(qty: number): Promise<void> {
    await this.fill(this.quantityInput, qty.toString(), 'Set quantity');
  }
}
