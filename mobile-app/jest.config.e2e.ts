/**
 * Jest configuration for E2E integration tests.
 *
 * This config is designed to be run from the mobile-app/ directory.
 * It mirrors the root jest.config.app.ts but with correct rootDir
 * for finding test files in e2e/integration/.
 */
export default {
  displayName: 'ionic-todo-test-e2e',
  preset: '../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '<rootDir>/../coverage/ionic-todo-test-e2e',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@ionic|@angular|@stencil|@firebase)',
  ],
  moduleNameMapper: {
    '^@ionic/core/components$': '<rootDir>/src/__mocks__/ionic-core.mock.ts',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testMatch: [
    '<rootDir>/e2e/integration/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>/src'],
};
