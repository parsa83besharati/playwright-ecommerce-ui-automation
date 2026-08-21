export interface Product {
  id: number;
  name: string;
  model?: string;
  price: number;
  currency: string;
  category: string;
  categoryPath: number;
  subCategory?: string;
  manufacturer: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | '2_3_days';
  quantity: number;
  imageUrl?: string;
  description?: string;
  rating?: number;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  productId: number;
  name: string;
  model: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  cartKey: string;
}

export interface Cart {
  items: CartItem[];
  subTotal: number;
  ecoTax: number;
  vat: number;
  total: number;
  itemCount: number;
}

export interface ShippingDetails {
  country: string;
  countryId: number;
  region: string;
  regionId: number;
  postcode: string;
  shippingMethod?: string;
  shippingCost?: number;
}