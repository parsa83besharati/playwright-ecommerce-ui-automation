import { ProductTemplates } from '../templates/product-templates';
import { CartTemplates } from '../templates/cart-templates';
import { ShippingTemplates } from '../templates/shipping-templates';

export const RegressionScenarios = {
  manufacturerFilter: {
    category: 'Components',
    categoryPath: 25,
    filter: { manufacturer: 'Apple', value: 8 },
    expectedMinProducts: 1,
  },
  sortOptions: {
    category: 'Components',
    options: [
      { label: 'Price (Low > High)', sort: 'p.price', order: 'ASC' },
      { label: 'Price (High > Low)', sort: 'p.price', order: 'DESC' },
      { label: 'Name (A - Z)', sort: 'pd.name', order: 'ASC' },
      { label: 'Name (Z - A)', sort: 'pd.name', order: 'DESC' },
    ],
  },
  cartCalculations: () => [
    { description: '1 iMac only', cart: CartTemplates.oneIMac() },
    { description: '3 products', cart: CartTemplates.threeProducts() },
    { description: 'iMac qty 3 + others', cart: CartTemplates.increasedQuantity() },
    { description: 'Empty cart', cart: CartTemplates.empty() },
  ],
  invalidCoupon: {
    couponCode: 'INVALID123',
    expectedError: 'Warning: Coupon is either invalid, expired or reached its usage limit!',
  },
  estimateShipping: {
    shippingDetails: ShippingTemplates.ukLondon(),
  },
};