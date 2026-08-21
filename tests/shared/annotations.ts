import type { TestInfo } from '@playwright/test';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Category = 'API' | 'UI';

export function setMetadata(
  testInfo: TestInfo,
  severity: Severity,
  feature: string,
  category: Category,
) {
  testInfo.annotations.push({ type: 'severity', description: severity });
  testInfo.annotations.push({ type: 'feature', description: feature });
  testInfo.annotations.push({ type: 'category', description: category });
}
