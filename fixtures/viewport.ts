import { test as base, Page } from '@playwright/test';

export type ViewportPreset = 'desktop' | 'tablet' | 'mobile';

export const viewports: Record<ViewportPreset, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 1024, height: 768 },
  mobile: { width: 390, height: 844 },
};

type ViewportFixtures = {
  setViewport: (preset: ViewportPreset) => Promise<void>;
};

export const test = base.extend<ViewportFixtures>({
  setViewport: async ({ page }, use) => {
    await use(async (preset: ViewportPreset) => {
      const { width, height } = viewports[preset];
      await page.setViewportSize({ width, height });
    });
  },
});

export { expect } from '@playwright/test';
