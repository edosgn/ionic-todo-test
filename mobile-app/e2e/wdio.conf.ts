/**
 * WebdriverIO Configuration for Appium E2E tests.
 *
 * Defines the test runner setup for running Appium-based
 * end-to-end tests on Android and iOS devices/emulators.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  port: 4723,
  path: '/',

  specs: ['./e2e/appium/**/*.spec.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
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
    },
  ],

  // Log levels: trace | debug | info | warn | error | silent
  logLevel: 'info',
  outputDir: './e2e/reports/appium-logs',

  bail: 0,

  baseUrl: 'http://localhost:4200',

  // Default timeout for all waitFor* commands
  waitforTimeout: 10000,

  // Default timeout for connection
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Services
  services: [
    [
      'appium',
      {
        args: {
          address: '127.0.0.1',
          port: 4723,
          relaxedSecurity: true,
        },
        command: 'appium',
      },
    ],
  ],

  // Framework: Mocha (BDD-style)
  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
    require: ['ts-node/register'],
  },

  // Reporters
  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: './e2e/reports/appium-junit',
        outputFileFormat: (options: any) => `appium-results-${options.cid}.xml`,
      },
    ],
  ],

  // Hooks
  before: () => {
    // Any global setup before tests
    console.log('[WDIO] Starting Appium test suite...');
  },

  after: (result: number, capabilities: any, specs: string[]) => {
    console.log(`[WDIO] Test suite completed. Result code: ${result}`);
  },

  beforeTest: (test: { title: string }) => {
    console.log(`[WDIO] Running test: ${test.title}`);
  },

  afterTest: (
    test: { title: string; fullName: string; passed: boolean },
    context: any,
    { error, result, duration, passed, retries }: any,
  ) => {
    if (error) {
      console.error(`[WDIO] Test failed: ${test.title}`);
      console.error(`[WDIO] Error: ${error.message}`);
    }
  },
};
