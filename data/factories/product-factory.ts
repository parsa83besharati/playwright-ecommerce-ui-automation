import { ProductBuilder } from '../builders/product-builder';
import { Product } from '../entities/product.entity';
import { DataRegistry } from '../registry/data-registry';

export class ProductFactory {
  constructor(private registry: DataRegistry) {}

  createIMac(): Product {
    const product = ProductBuilder.anIMac().build();
    this.registry.register('product', product.id, product);
    return product;
  }

  createCanonEOS(): Product {
    const product = ProductBuilder.aCanonEOS().build();
    this.registry.register('product', product.id, product);
    return product;
  }

  createPalmTreoPro(): Product {
    const product = ProductBuilder.aPalmTreoPro().build();
    this.registry.register('product', product.id, product);
    return product;
  }

  createOutOfStockProduct(): Product {
    const product = ProductBuilder.anOutOfStockProduct().build();
    this.registry.register('product', product.id, product);
    return product;
  }

  createThreeTestProducts(): Product[] {
    return [this.createIMac(), this.createCanonEOS(), this.createPalmTreoPro()];
  }

  createBatch(count: number): Product[] {
    return Array.from({ length: count }, () => {
      const product = ProductBuilder.aProduct().build();
      this.registry.register('product', product.id, product);
      return product;
    });
  }
}