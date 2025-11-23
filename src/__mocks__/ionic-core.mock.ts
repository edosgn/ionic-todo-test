// Mock for @ionic/core/components
export const IonicModule = {
  forRoot: () => ({
    ngModule: class MockIonicModule {},
    providers: [],
  }),
};

export default {};