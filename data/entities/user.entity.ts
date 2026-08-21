export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  newsletter: boolean;
  privacyAgreed: boolean;
  status: 'active' | 'inactive';
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  country: string;
  countryId: number;
  region: string;
  regionId: number;
  isDefault: boolean;
}