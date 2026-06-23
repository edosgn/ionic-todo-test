/**
 * Playwright Configuration for BDD tests.
 *
 * Used by the Cucumber step definitions to launch a browser
 * and interact with the Ionic app during BDD test execution.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // The Cucumber tests are run via cucumber-js, not Playwright test runner.
  // This config is used mainly to provide type definitions and
  // to auto-start the dev server when running Playwright-based checks.
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    viewport: { width: 390, height: 844 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Auto-start the Ionic dev server before running tests
  webServer: {
    command: 'cd mobile-app && npx ng serve --port 4200',
    port: 4200,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Retry on CI
  retries: process.env.CI ? 2 : 0,

  // Reporter
  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/reports/playwright-report' }],
  ],
});
