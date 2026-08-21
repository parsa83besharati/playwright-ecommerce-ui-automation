import { Cart } from '../entities/product.entity';

export const CartTemplates = {
  empty: (): Cart => ({
    items: [],
    subTotal: 0,
    ecoTax: 0,
    vat: 0,
    total: 0,
    itemCount: 0,
  }),

  oneIMac: (): Cart => ({
    items: [{
      productId: 41,
      name: 'iMac',
      model: 'Product 14',
      quantity: 1,
      unitPrice: 170.00,
      lineTotal: 170.00,
      cartKey: '211399',
    }],
    subTotal: 170.00,
    ecoTax: 2.00,
    vat: 34.00,
    total: 206.00,
    itemCount: 1,
  }),

  threeProducts: (): Cart => ({
    items: [
      { productId: 41, name: 'iMac', model: 'Product 14', quantity: 1, unitPrice: 170.00, lineTotal: 170.00, cartKey: '211399' },
      { productId: 30, name: 'Canon EOS 5D', model: 'Product 3', quantity: 1, unitPrice: 134.00, lineTotal: 134.00, cartKey: '211400' },
      { productId: 29, name: 'Palm Treo Pro', model: 'Product 2', quantity: 1, unitPrice: 337.99, lineTotal: 337.99, cartKey: '211401' },
    ],
    subTotal: 641.99,
    ecoTax: 6.00,
    vat: 128.40,
    total: 776.39,
    itemCount: 3,
  }),

  increasedQuantity: (): Cart => ({
    items: [
      { productId: 41, name: 'iMac', model: 'Product 14', quantity: 3, unitPrice: 170.00, lineTotal: 510.00, cartKey: '211399' },
      { productId: 30, name: 'Canon EOS 5D', model: 'Product 3', quantity: 1, unitPrice: 134.00, lineTotal: 134.00, cartKey: '211400' },
      { productId: 29, name: 'Palm Treo Pro', model: 'Product 2', quantity: 1, unitPrice: 337.99, lineTotal: 337.99, cartKey: '211401' },
    ],
    subTotal: 981.99,
    ecoTax: 10.00,
    vat: 196.40,
    total: 1188.39,
    itemCount: 5,
  }),
};