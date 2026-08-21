import { faker } from '@faker-js/faker';
import { Product } from '../entities/product.entity';

export class ProductBuilder {
  private product: Partial<Product> = {};

  static aProduct(): ProductBuilder {
    const builder = new ProductBuilder();
    builder.product = {
      id: faker.number.int({ min: 28, max: 107 }),
      name: faker.commerce.productName(),
      model: `Product ${faker.number.int({ min: 1, max: 20 })}`,
      price: parseFloat(faker.commerce.price({ min: 98, max: 2000 })),
      currency: 'USD',
      category: 'Components',
      categoryPath: 25,
      manufacturer: faker.helpers.arrayElement(['Apple', 'Canon', 'HTC', 'Nikon', 'Palm', 'Sony', 'Hewlett-Packard']),
      availability: 'in_stock',
      quantity: 1,
    };
    return builder;
  }

  static anIMac(): ProductBuilder {
    return ProductBuilder.aProduct()
      .withId(41).withName('iMac').withPrice(170.00).withModel('Product 14')
      .withManufacturer('Apple').withCategory('Laptops & Notebooks').withCategoryPath(18);
  }

  static aCanonEOS(): ProductBuilder {
    return ProductBuilder.aProduct()
      .withId(30).withName('Canon EOS 5D').withPrice(134.00)
      .withManufacturer('Canon').withCategory('Cameras').withCategoryPath(33);
  }

  static aPalmTreoPro(): ProductBuilder {
    return ProductBuilder.aProduct()
      .withId(29).withName('Palm Treo Pro').withPrice(337.99)
      .withManufacturer('Palm').withCategory('Phone, Tablets & Ipod').withCategoryPath(57);
  }

  static anOutOfStockProduct(): ProductBuilder {
    return ProductBuilder.aProduct()
      .withId(32).withName('iPod Touch').withPrice(194.00)
      .withAvailability('out_of_stock').withManufacturer('Apple');
  }

  withId(id: number): this { this.product.id = id; return this; }
  withName(name: string): this { this.product.name = name; return this; }
  withPrice(price: number): this { this.product.price = price; return this; }
  withModel(model: string): this { this.product.model = model; return this; }
  withManufacturer(manufacturer: string): this { this.product.manufacturer = manufacturer; return this; }
  withCategory(category: string): this { this.product.category = category; return this; }
  withCategoryPath(path: number): this { this.product.categoryPath = path; return this; }
  withAvailability(status: Product['availability']): this { this.product.availability = status; return this; }
  inStock(): this { return this.withAvailability('in_stock'); }
  outOfStock(): this { return this.withAvailability('out_of_stock'); }

  build(): Product {
    return { ...this.product } as Product;
  }
}