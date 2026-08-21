import { logger } from './logger';

/**
 * Navigation lines go to stdout (visible in Playwright list reporter)
 * and to the per-test log file via Winston (no duplicate console line).
 */
export function logNavigation(message: string): void {
  const line = `[navigation] ${message}`;
  console.log(line);
  logger.info(line);
}

export function logNavigationError(message: string, error: unknown): void {
  const detail = error instanceof Error ? error.message : String(error);
  logNavigation(`${message} — ${detail}`);
}
