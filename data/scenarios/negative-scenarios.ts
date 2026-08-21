import { ProductTemplates } from '../templates/product-templates';
import { ShippingTemplates } from '../templates/shipping-templates';

export const NegativeScenarios = {
  outOfStockProductUI: {
    product: ProductTemplates.iPodTouch(),
  },
  outOfStockProductJS: {
    productId: 32,
    jsCommand: "cart.add('32')",
  },
  negativeQuantity: {
    productId: 41,
    invalidQuantity: -1,
  },
  zeroQuantity: {
    productId: 41,
    invalidQuantity: 0,
  },
  textQuantity: {
    productId: 41,
    invalidQuantity: 'abc',
  },
  largeQuantity: {
    productId: 41,
    invalidQuantity: 999999,
  },
  emptySearch: {
    searchTerm: '',
  },
  xssSearch: {
    searchTerm: "<script>alert('XSS')</script>",
  },
  emptyRegistration: {
    user: { firstName: '', lastName: '', email: '', phone: '', password: '' },
  },
  invalidLogin: {
    email: 'fakeuser@example.com',
    password: 'wrongpassword',
  },
  invalidShippingPostcode: {
    shippingDetails: ShippingTemplates.invalidPostcode(),
  },
  directCheckoutAccess: {
    url: '/index.php?route=checkout/checkout',
  },
};