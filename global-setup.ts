import { getBaseUrl, logBaseUrlOnce } from './config/env';

export default async function globalSetup(): Promise<void> {
  logBaseUrlOnce('global-setup');
  // Ensure worker processes inherit the resolved value
  process.env.BASE_URL = getBaseUrl();
}
