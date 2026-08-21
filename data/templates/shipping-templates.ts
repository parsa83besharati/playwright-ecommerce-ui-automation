import { ShippingDetails } from '../entities/product.entity';

export const ShippingTemplates = {
  ukLondon: (): ShippingDetails => ({
    country: 'United Kingdom',
    countryId: 222,
    region: 'Greater London',
    regionId: 3553,
    postcode: 'SW1A 1AA',
  }),

  ukManchester: (): ShippingDetails => ({
    country: 'United Kingdom',
    countryId: 222,
    region: 'Greater Manchester',
    regionId: 3554,
    postcode: 'M1 1AA',
  }),

  invalidPostcode: (): ShippingDetails => ({
    country: 'United Kingdom',
    countryId: 222,
    region: 'Greater London',
    regionId: 3553,
    postcode: '!@#$%^',
  }),

  noCountry: (): Partial<ShippingDetails> => ({
    country: '',
    region: '',
    postcode: '',
  }),
};