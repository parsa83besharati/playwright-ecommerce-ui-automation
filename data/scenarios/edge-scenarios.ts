import { ProductTemplates } from '../templates/product-templates';
import { CartTemplates } from '../templates/cart-templates';
import { UserTemplates } from '../templates/user-templates';

export const EdgeScenarios = {
  manyProducts: {
    productCount: 10,
    products: Array.from({ length: 10 }, () => ProductTemplates.iMac()),
  },
  maxQuantity: {
    cart: CartTemplates.oneIMac(), // will be used to set large qty
    quantity: 999,
  },
  boundaryNames: {
    user: UserTemplates.maxLengthName(),
  },
  longSearch: {
    searchTerm: 'a'.repeat(500),
  },
  singleCharSearch: {
    searchTerm: 'a',
  },
  priceBoundary: {
    min: 98,
    max: 98,
  },
  removeLastItem: {
    initialCart: CartTemplates.oneIMac(),
    productToRemove: 41,
    expectedCart: CartTemplates.empty(),
  },
};