import 'jest-preset-angular/setup-jest';

// Mock IndexedDB for Firebase
const mockIndexedDB = {
  open: () => ({
    onsuccess: () => { /* mock implementation */ },
    onerror: () => { /* mock implementation */ },
    result: {
      transaction: () => ({
        objectStore: () => ({
          get: () => { /* mock implementation */ },
          put: () => { /* mock implementation */ },
          add: () => { /* mock implementation */ },
          delete: () => { /* mock implementation */ },
          clear: () => { /* mock implementation */ },
        }),
      }),
    },
  }),
  deleteDatabase: () => { /* mock implementation */ },
};

Object.defineProperty(globalThis, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
});

// Mock IDBTransaction
Object.defineProperty(globalThis, 'IDBTransaction', {
  value: {
    READ_ONLY: 'readonly',
    READ_WRITE: 'readwrite',
    VERSION_CHANGE: 'versionchange',
  },
  writable: true,
});

// Mock IDBKeyRange
Object.defineProperty(globalThis, 'IDBKeyRange', {
  value: {
    bound: () => { /* mock implementation */ },
    only: () => { /* mock implementation */ },
    lowerBound: () => { /* mock implementation */ },
    upperBound: () => { /* mock implementation */ },
  },
  writable: true,
});

// Mock window.location for Firebase
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:4200',
    hostname: 'localhost',
    port: '4200',
    protocol: 'http:',
  },
  writable: true,
});

// Mock console methods to reduce test noise  
Object.assign(globalThis, {
  console: {
    ...console,
    log: () => { /* mock implementation */ },
    warn: () => { /* mock implementation */ },
    error: () => { /* mock implementation */ },
    info: () => { /* mock implementation */ },
    debug: () => { /* mock implementation */ },
  }
});