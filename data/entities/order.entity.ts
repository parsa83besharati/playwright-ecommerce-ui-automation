import { CartItem } from './product.entity';
import { ShippingDetails } from './product.entity';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subTotal: number;
  ecoTax: number;
  vat: number;
  total: number;
  shippingDetails?: ShippingDetails;
  couponCode?: string;
  status: 'pending' | 'confirmed';
}