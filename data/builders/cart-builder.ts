import { Cart, CartItem } from '../entities/product.entity';

export class CartBuilder {
  private cart: Cart = { items: [], subTotal: 0, ecoTax: 0, vat: 0, total: 0, itemCount: 0 };

  static anEmptyCart(): CartBuilder { return new CartBuilder(); }

  static aCartWithOneItem(): CartBuilder {
    return new CartBuilder().withItem({
      productId: 41, name: 'iMac', model: 'Product 14', quantity: 1,
      unitPrice: 170.00, lineTotal: 170.00, cartKey: '211399',
    });
  }

  static aCartWithThreeItems(): CartBuilder {
    return new CartBuilder()
      .withItem({ productId: 41, name: 'iMac', model: 'Product 14', quantity: 1, unitPrice: 170.00, lineTotal: 170.00, cartKey: '211399' })
      .withItem({ productId: 30, name: 'Canon EOS 5D', model: 'Product 3', quantity: 1, unitPrice: 134.00, lineTotal: 134.00, cartKey: '211400' })
      .withItem({ productId: 29, name: 'Palm Treo Pro', model: 'Product 2', quantity: 1, unitPrice: 337.99, lineTotal: 337.99, cartKey: '211401' });
  }

  withItem(item: CartItem): this {
    this.cart.items.push(item);
    this.recalculate();
    return this;
  }

  withQuantity(productId: number, quantity: number): this {
    const item = this.cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      item.lineTotal = item.unitPrice * quantity;
    }
    this.recalculate();
    return this;
  }

  removeItem(productId: number): this {
    this.cart.items = this.cart.items.filter(i => i.productId !== productId);
    this.recalculate();
    return this;
  }

  private recalculate(): void {
    this.cart.itemCount = this.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    this.cart.subTotal = this.cart.items.reduce((sum, i) => sum + i.lineTotal, 0);
    this.cart.ecoTax = this.cart.itemCount * 2.00;
    this.cart.vat = parseFloat((this.cart.subTotal * 0.20).toFixed(2));
    this.cart.total = parseFloat((this.cart.subTotal + this.cart.ecoTax + this.cart.vat).toFixed(2));
  }

  build(): Cart {
    return { ...this.cart, items: [...this.cart.items] };
  }
}