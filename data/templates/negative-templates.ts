export const NegativeTemplates = {
  invalidCoupon: () => 'INVALID123',
  emptyCoupon: () => '',
  invalidGiftCertificate: () => 'FAKE-GIFT-123',
  emptyGiftCertificate: () => '',
  invalidLoginEmail: () => 'fakeuser@example.com',
  invalidLoginPassword: () => 'wrongpassword',
  sqlInjectionLogin: () => "' OR '1'='1' --",
  xssSearchPayload: () => "<script>alert('XSS')</script>",
  duplicateEmail: () => 'john.doe@example.com',
  notFoundUrl: () => '/index.php?route=product/product&product_id=99999999',
  checkoutUrl: () => '/index.php?route=checkout/checkout',
};
