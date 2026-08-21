import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

function loadEnvFile(): void {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];
  const envPath = candidates.find((p) => fs.existsSync(p));
  if (envPath) {
    dotenv.config({ path: envPath, override: false });
  } else {
    dotenv.config();
  }
}

loadEnvFile();

const DEFAULT_BASE_URL = 'https://ecommerce-playground.lambdatest.io';

let cachedBaseUrl: string | null = null;

/**
 * Application under test origin from `.env` (`BASE_URL`).
 * Trailing slashes are stripped; missing protocol defaults to https.
 */
export function getBaseUrl(): string {
  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  let raw = process.env.BASE_URL?.trim() || DEFAULT_BASE_URL;
  raw = raw.replace(/\/+$/, '');

  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  cachedBaseUrl = raw;
  return cachedBaseUrl;
}

/** Log once per process so test output shows which origin is active. */
export function logBaseUrlOnce(label = 'env'): void {
  const base = getBaseUrl();
  const fromEnv = Boolean(process.env.BASE_URL?.trim());
  console.log(
    `[${label}] BASE_URL=${base}${fromEnv ? ' (from .env)' : ' (default fallback)'}`,
  );
}

/**
 * Resolves a path or absolute URL against `BASE_URL`.
 * @example resolveUrl('/index.php?route=checkout/cart')
 */
export function resolveUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const pathPart = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${getBaseUrl()}${pathPart}`;
}
