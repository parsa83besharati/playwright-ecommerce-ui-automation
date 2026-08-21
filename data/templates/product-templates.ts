import { Product } from '../entities/product.entity';

export const ProductTemplates = {
  iMac: (): Product => ({
    id: 41,
    name: 'iMac',
    model: 'Product 14',
    price: 170.00,
    currency: 'USD',
    category: 'Laptops & Notebooks',
    categoryPath: 18,
    manufacturer: 'Apple',
    availability: 'in_stock',
    quantity: 1,
  }),

  canonEOS: (): Product => ({
    id: 30,
    name: 'Canon EOS 5D',
    model: 'Product 3',
    price: 134.00,
    currency: 'USD',
    category: 'Cameras',
    categoryPath: 33,
    manufacturer: 'Canon',
    availability: 'in_stock',
    quantity: 1,
  }),

  palmTreoPro: (): Product => ({
    id: 29,
    name: 'Palm Treo Pro',
    model: 'Product 2',
    price: 337.99,
    currency: 'USD',
    category: 'Phone, Tablets & Ipod',
    categoryPath: 57,
    manufacturer: 'Palm',
    availability: 'in_stock',
    quantity: 1,
  }),

  iPodTouch: (): Product => ({
    id: 32,
    name: 'iPod Touch',
    model: 'Product 5',
    price: 194.00,
    currency: 'USD',
    category: 'Phone, Tablets & Ipod',
    categoryPath: 57,
    manufacturer: 'Apple',
    availability: 'out_of_stock',
    quantity: 0,
  }),

  nikonD300: (): Product => ({
    id: 31,
    name: 'Nikon D300',
    price: 98.00,
    currency: 'USD',
    category: 'Components',
    categoryPath: 25,
    manufacturer: 'Nikon',
    availability: 'in_stock',
    quantity: 1,
  }),
};

/** In-stock product IDs used for cart capacity edge cases. */
export const edgeTenProductIds = [41, 30, 29, 28, 33, 34, 36, 40, 42, 43] as const;