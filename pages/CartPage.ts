import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly cartTable = '[data-testid="cart-table"], .table.table-bordered';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly subTotal = '[data-testid="sub-total"], td:has-text("Sub-Total") + td strong';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly ecoTax = '[data-testid="eco-tax"], td:has-text("Eco Tax") + td strong';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly vat = '[data-testid="vat"], td:has-text("VAT") + td strong';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly total = '[data-testid="total"], td:has-text("Total") + td strong';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly emptyMessage =
    '[data-testid="empty-cart-msg"], text="Your shopping cart is empty!"';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly checkoutButton = '[data-testid="checkout-btn"], a:has-text("Checkout")';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly couponAccordion = '[data-testid="coupon-accordion"], text="Use Coupon Code"';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly couponInput = '[data-testid="coupon-input"], #input-coupon';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly applyCouponBtn = '[data-testid="apply-coupon-btn"], #button-coupon';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly shippingAccordion =
    '[data-testid="shipping-accordion"], text="Estimate Shipping & Taxes"';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly countrySelect = '[data-testid="country-select"], select[name="country_id"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly regionSelect = '[data-testid="region-select"], select[name="zone_id"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly postcodeInput = '[data-testid="postcode-input"], input[name="postcode"]';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly getQuotesBtn = '[data-testid="get-quotes-btn"], #button-quote';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly giftCertAccordion =
    '[data-testid="gift-cert-accordion"], text="Use Gift Certificate"';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly giftCertInput = '[data-testid="gift-cert-input"], #input-voucher';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly applyGiftCertBtn = '[data-testid="apply-gift-btn"], #button-voucher';
  readonly shippingModal = '#modal-shipping';
  readonly alertDanger = '.alert-danger';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/index.php?route=checkout/cart');
    await this.waitForVisible(this.cartTable);
  }

  async getItemCount(): Promise<number> {
    return this.getCount('.table.table-bordered tbody tr');
  }

  async getCartKeyForProduct(productId: number): Promise<string | null> {
    const row = this.page.locator(`tr:has(a[href*="product_id=${productId}"])`);
    const input = row.locator('input[name^="quantity"]');
    const count = await input.count();
    if (count === 0) {
      return null;
    }
    const name = await input.getAttribute('name');
    const match = name?.match(/\[(\d+)\]/);
    return match ? match[1] : null;
  }

  async updateQuantity(cartKey: string, quantity: number): Promise<void> {
    const inputSelector = `input[name="quantity[${cartKey}]"]`;
    await this.fill(inputSelector, quantity.toString(), `Update qty of key ${cartKey}`);
    const updateBtn = this.page
      .locator(inputSelector)
      .locator('..')
      .locator('button[title="Update"]');
    await updateBtn.click();
    await this.waitForNetworkIdle();
  }

  async removeItem(cartKey: string): Promise<void> {
    const removeBtnSelector = `button[onclick*="cart.remove('${cartKey}')"]`;
    await this.click(removeBtnSelector, `Remove item ${cartKey}`);
    await this.waitForNetworkIdle();
  }

  async getSubTotal(): Promise<number> {
    const text = await this.getText(this.subTotal);
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.getText(this.total);
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async applyCoupon(code: string): Promise<void> {
    await this.click(this.couponAccordion, 'Open coupon section');
    await this.fill(this.couponInput, code, 'Coupon code');
    await this.click(this.applyCouponBtn, 'Apply coupon');
  }

  async estimateShipping(country: string, region: string, postcode: string): Promise<void> {
    await this.click(this.shippingAccordion, 'Open shipping section');
    await this.selectOptionByValue(this.countrySelect, country);
    await this.waitForNetworkIdle();
    await this.selectOptionByValue(this.regionSelect, region);
    await this.fill(this.postcodeInput, postcode, 'Postcode');
    await this.click(this.getQuotesBtn, 'Get quotes');
  }

  async applyGiftCertificate(code: string): Promise<void> {
    await this.click(this.giftCertAccordion, 'Open gift certificate section');
    await this.fill(this.giftCertInput, code, 'Gift certificate code');
    await this.click(this.applyGiftCertBtn, 'Apply gift certificate');
  }
}
