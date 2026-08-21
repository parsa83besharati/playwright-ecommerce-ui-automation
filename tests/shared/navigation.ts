import type { Page } from '@playwright/test';
import { resolveUrl } from '../../config/env';

/** Navigate with `BASE_URL` from `.env` when tests cannot use a page object. */
export async function gotoAppPath(page: Page, pathOrUrl: string) {
  return page.goto(resolveUrl(pathOrUrl));
}
