/**
 * Appium Setup Helper
 *
 * Provides reusable driver initialization and cleanup for Appium E2E tests.
 * Uses WebdriverIO to create a session that connects to the Appium server
 * and controls an Android emulator or device running the Ionic app.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { remote, Browser } from 'webdriverio';

/**
 * Default Appium server URL
 */
const APPIUM_SERVER = process.env.APPIUM_SERVER || 'http://127.0.0.1:4723';

/**
 * Default capabilities for Android emulator testing.
 * Override via environment variables for CI/CD or different devices.
 */
const DEFAULT_CAPABILITIES = {
  platformName: 'Android',
  'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'emulator-5554',
  'appium:platformVersion': process.env.APPIUM_PLATFORM_VERSION || '13.0',
  'appium:automationName': 'UiAutomator2',
  'appium:app': process.env.APPIUM_APP_PATH || '',
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
  'appium:fullReset': false,
  'appium:newCommandTimeout': 60,
  'appium:appWaitActivity': '*.MainActivity',
};

/**
 * Creates a new Appium driver session.
 *
 * @param customCapabilities - Optional overrides for the default capabilities
 * @returns A WebdriverIO Browser instance connected to the app
 *
 * @example
 * ```typescript
 * const driver = await createDriver();
 * const element = await driver.$('~add-category-button');
 * await element.click();
 * await deleteSession(driver);
 * ```
 */
export async function createDriver(
  customCapabilities: Record<string, any> = {},
): Promise<Browser<'async'>> {
  const capabilities = { ...DEFAULT_CAPABILITIES, ...customCapabilities };

  const driver = await remote({
    port: 4723,
    path: '/',
    logLevel: 'info',
    connectionRetryCount: 3,
    connectionRetryTimeout: 30000,
    capabilities,
  });

  console.log('[Appium] Session started. Session ID:', driver.sessionId);
  return driver as unknown as Browser<'async'>;
}

/**
 * Closes the Appium driver session and releases resources.
 *
 * @param driver - The WebdriverIO Browser instance to close
 */
export async function deleteSession(driver: Browser<'async'>): Promise<void> {
  if (driver) {
    try {
      await driver.deleteSession();
      console.log('[Appium] Session closed successfully.');
    } catch (error) {
      console.error('[Appium] Error closing session:', error);
    }
  }
}

/**
 * Waits for an element to be visible and returns it.
 * Useful for ensuring the app UI has rendered before interacting.
 *
 * @param driver - The WebdriverIO Browser instance
 * @param selector - Element selector (accessibility ID, XPath, etc.)
 * @param timeout - Maximum wait time in milliseconds (default: 10000)
 * @returns The located element
 */
export async function waitForElement(
  driver: Browser<'async'>,
  selector: string,
  timeout = 10000,
) {
  const element = await driver.$(selector);
  await element.waitForDisplayed({ timeout });
  return element;
}

/**
 * Takes a screenshot and saves it to the specified path.
 * Useful for debugging failed tests.
 *
 * @param driver - The WebdriverIO Browser instance
 * @param filePath - Path to save the screenshot (e.g., './screenshots/error.png')
 */
export async function takeScreenshot(
  driver: Browser<'async'>,
  filePath: string,
): Promise<void> {
  const screenshot = await driver.takeScreenshot();
  const fs = await import('fs/promises');
  await fs.writeFile(filePath, screenshot, 'base64');
  console.log(`[Appium] Screenshot saved to ${filePath}`);
}

/**
 * Common selectors used throughout the app.
 * These should match the accessibility IDs or test IDs set in the Ionic components.
 */
export const SELECTORS = {
  // Categories
  CATEGORY_PAGE: '~categories-page',
  ADD_CATEGORY_BUTTON: '~add-category-button',
  CATEGORY_NAME_INPUT: '~category-name-input',
  CATEGORY_COLOR_INPUT: '~category-color-input',
  CATEGORY_ICON_SELECTOR: '~category-icon-selector',
  SAVE_CATEGORY_BUTTON: '~save-category-button',
  DELETE_CATEGORY_BUTTON: '~delete-category-button',
  CONFIRM_DELETE_BUTTON: '~confirm-delete-button',

  // Tasks
  TASK_PAGE: '~tasks-page',
  ADD_TASK_BUTTON: '~add-task-button',
  TASK_TITLE_INPUT: '~task-title-input',
  TASK_DESCRIPTION_INPUT: '~task-description-input',
  TASK_CATEGORY_SELECTOR: '~task-category-selector',
  SAVE_TASK_BUTTON: '~save-task-button',
  TASK_CHECKBOX: '~task-checkbox',
  SEARCH_BAR: '~search-bar-input',

  // Navigation
  NAV_CATEGORIES_BUTTON: '~nav-categories-button',
  NAV_BACK_BUTTON: '~nav-back-button',
  NAV_TASKS_TAB: '~nav-tasks-tab',
} as const;
