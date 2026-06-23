export default {
  displayName: 'ionic-todo-test',
  preset: './jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: './coverage/ionic-todo-test',
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
    'node_modules/(?!.*\\.mjs$|@ionic|@angular|@stencil|@firebase)'
  ],
  moduleNameMapper: {
    // Mock ES modules that Jest can't handle
    '^@ionic/core/components$': '<rootDir>/src/__mocks__/ionic-core.mock.ts',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
    '<rootDir>/e2e/integration/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/test-setup.ts',
    '!src/setup-jest.ts',
    '!src/main.ts',
    '!src/environments/**',
    '!src/__mocks__/**',
    '!src/**/*.mock.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 35,
      branches: 35,
      functions: 35,
      lines: 33,
    },
  },
};
