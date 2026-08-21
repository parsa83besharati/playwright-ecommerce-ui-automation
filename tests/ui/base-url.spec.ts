import { test, expect } from '../../fixtures/fixtures';
import { getBaseUrl } from '../../config/env';

test.describe('BASE_URL configuration', { tag: '@config' }, () => {
  test('TC-BASE-URL-001 — navigation uses BASE_URL from .env', async ({ homePage, page }) => {
    const expectedBase = getBaseUrl();
    await homePage.goto();
    const current = page.url();
    expect(current.startsWith(expectedBase)).toBe(true);
    expect(current).toMatch(/^https?:\/\//);
  });
});
