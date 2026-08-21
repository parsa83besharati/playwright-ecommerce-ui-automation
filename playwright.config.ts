import { defineConfig, devices } from '@playwright/test';
import { getBaseUrl, logBaseUrlOnce } from './config/env';

const baseURL = getBaseUrl();
logBaseUrlOnce('playwright.config');

/** Pass resolved BASE_URL to all workers (alongside dotenv in config/env.ts). */
process.env.BASE_URL = baseURL;

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),
  timeout: 60000,
  retries: 0,
  outputDir: 'test-results',

  use: {
    baseURL,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  reporter: [
    ['list'],
    [
      'playwright-enhanced-reporter',
      {
        title: 'Playwright E-Commerce Test Report',
        includeCharts: true,
        theme: 'dark',
        outputFolder: 'enhanced-report',
      },
    ],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
  ],
});
