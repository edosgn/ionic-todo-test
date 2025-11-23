// Simple mocks for Firebase services in tests

export const mockRemoteConfig = {
  fetchAndActivate: jest.fn().mockResolvedValue(true),
  getValue: jest.fn().mockReturnValue({
    asBoolean: () => false,
    asString: () => '',
    asNumber: () => 0,
  }),
  getAll: jest.fn().mockReturnValue({}),
};

export const mockFirebaseApp = {
  name: 'test-app',
  options: {
    apiKey: 'test-key',
    projectId: 'test-project',
  },
};

jest.mock('@angular/fire/app', () => ({
  initializeApp: jest.fn(() => mockFirebaseApp),
  getApp: jest.fn(() => mockFirebaseApp),
  provideFirebaseApp: jest.fn(() => []),
}));

jest.mock('@angular/fire/remote-config', () => ({
  getRemoteConfig: jest.fn(() => mockRemoteConfig),
  provideRemoteConfig: jest.fn(() => []),
  fetchAndActivate: jest.fn(() => Promise.resolve(true)),
  getValue: jest.fn(() => ({
    asBoolean: () => false,
    asString: () => '',
    asNumber: () => 0,
  })),
  getAll: jest.fn(() => ({})),
}));