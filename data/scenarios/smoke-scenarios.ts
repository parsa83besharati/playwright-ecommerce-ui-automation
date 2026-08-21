import { ProductTemplates } from '../templates/product-templates';
import { CartTemplates } from '../templates/cart-templates';

export const SmokeScenarios = {
  addSingleProductFromHomepage: {
    product: ProductTemplates.iMac(),
  },
  increaseCartQuantity: {
    initialCart: CartTemplates.oneIMac(),
    newQuantity: 3,
    expectedCart: CartTemplates.increasedQuantity(),
  },
  removeProductFromCart: {
    initialCart: CartTemplates.threeProducts(),
    productToRemove: 30,
    expectedCart: CartTemplates.oneIMac(), // after removal, only iMac remains
  },
  searchForProduct: {
    searchTerm: 'palm',
    expectedMinResults: 1,
  },
  productDetailPage: {
    product: ProductTemplates.iMac(),
  },
};