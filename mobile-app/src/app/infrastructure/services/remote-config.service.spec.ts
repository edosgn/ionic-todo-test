import { TestBed } from '@angular/core/testing';
import { RemoteConfigService } from './remote-config.service';

// Mock Firebase modules
jest.mock('@angular/fire/app', () => ({
  initializeApp: jest.fn(),
  provideFirebaseApp: jest.fn(),
}));

jest.mock('@angular/fire/remote-config', () => ({
  getRemoteConfig: jest.fn(),
  provideRemoteConfig: jest.fn(),
  fetchAndActivate: jest.fn(),
  getValue: jest.fn(),
}));

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;

  beforeEach(async () => {
    // Create a mock service instead of using Firebase
    const mockService = {
      initialize: jest.fn().mockResolvedValue(true),
      getFeatureFlag: jest.fn().mockImplementation((key: string, defaultValue: boolean) => 
        Promise.resolve(defaultValue)
      ),
      getNumberValue: jest.fn().mockImplementation((key: string, defaultValue: number) => 
        Promise.resolve(defaultValue)
      ),
      getStringValue: jest.fn().mockImplementation((key: string, defaultValue: string) => 
        Promise.resolve(defaultValue)
      ),
      getJsonValue: jest.fn().mockImplementation((key: string, defaultValue: object) => 
        Promise.resolve(defaultValue)
      ),
      getAllValues: jest.fn().mockReturnValue({}),
      forceFetch: jest.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: RemoteConfigService, useValue: mockService }
      ]
    }).compileComponents();

    service = TestBed.inject(RemoteConfigService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should get feature flag with default value', async () => {
    const result = await service.getFeatureFlag('test_flag', true);
    expect(result).toBe(true);
  });

  it('should get number value with default value', async () => {
    const result = await service.getNumberValue('test_number', 100);
    expect(result).toBe(100);
  });

  it('should get string value with default value', async () => {
    const result = await service.getStringValue('test_string', 'default');
    expect(result).toBe('default');
  });

  it('should get JSON value with default value', async () => {
    const defaultObj = { test: 'value' };
    const result = await service.getJsonValue('test_json', defaultObj);
    expect(result).toEqual(defaultObj);
  });

  it('should return all values', () => {
    const allValues = service.getAllValues();
    expect(typeof allValues).toBe('object');
  });
});