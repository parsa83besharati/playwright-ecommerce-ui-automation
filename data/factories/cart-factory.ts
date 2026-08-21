import { CartBuilder } from '../builders/cart-builder';
import { Cart } from '../entities/product.entity';
import { DataRegistry } from '../registry/data-registry';

export class CartFactory {
  constructor(private registry: DataRegistry) {}

  createEmptyCart(): Cart {
    const cart = CartBuilder.anEmptyCart().build();
    this.registry.register('cart', 'current', cart);
    return cart;
  }

  createCartWithOneItem(): Cart {
    const cart = CartBuilder.aCartWithOneItem().build();
    this.registry.register('cart', 'current', cart);
    return cart;
  }

  createCartWithThreeItems(): Cart {
    const cart = CartBuilder.aCartWithThreeItems().build();
    this.registry.register('cart', 'current', cart);
    return cart;
  }

  createCartWithQuantity(productId: number, quantity: number): Cart {
    const cart = CartBuilder.aCartWithOneItem()
      .withQuantity(productId, quantity)
      .build();
    this.registry.register('cart', 'current', cart);
    return cart;
  }
}