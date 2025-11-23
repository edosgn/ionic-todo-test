import { TestBed } from '@angular/core/testing';
import { RemoteConfigService } from '../../infrastructure/services/remote-config.service';
import { FeatureFlagStore } from './feature-flag.store';

describe('FeatureFlagStore', () => {
  let store: FeatureFlagStore;
  let mockRemoteConfigService: Partial<RemoteConfigService>;

  beforeEach(async () => {
    // Create a mock service
    mockRemoteConfigService = {
      initialize: jest.fn().mockResolvedValue(true),
      getFeatureFlag: jest.fn().mockResolvedValue(true),
      getNumberValue: jest.fn().mockResolvedValue(200),
      getStringValue: jest.fn().mockResolvedValue('Mis Tareas'),
      getAllValues: jest.fn().mockReturnValue({}),
    };

    await TestBed.configureTestingModule({
      providers: [
        FeatureFlagStore,
        { provide: RemoteConfigService, useValue: mockRemoteConfigService }
      ]
    }).compileComponents();

    store = TestBed.inject(FeatureFlagStore);
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should have default feature flags', () => {
    const flags = store.featureFlags();
    expect(flags.enableCategories).toBe(true);
    expect(flags.enableDeleteTask).toBe(true);
    expect(flags.remoteTitle).toBe("Mis Tareas");
    expect(flags.maxTasks).toBe(200);
  });

  it('should have computed selectors', () => {
    expect(store.categoriesEnabled()).toBe(true);
    expect(store.deleteTaskEnabled()).toBe(true);
    expect(store.appTitle()).toBe("Mis Tareas");
    expect(store.maxTasksLimit()).toBe(200);
  });

  it('should show categories when enabled', () => {
    expect(store.shouldShowCategories()).toBe(false); // false because not initialized
  });

  it('should show delete button when enabled', () => {
    expect(store.shouldShowDeleteButton()).toBe(false); // false because not initialized
  });

  it('should reset to defaults', () => {
    store.resetToDefaults();
    
    const flags = store.featureFlags();
    expect(flags.enableCategories).toBe(true);
    expect(flags.enableDeleteTask).toBe(true);
    expect(flags.remoteTitle).toBe("Mis Tareas");
    expect(flags.maxTasks).toBe(200);
    expect(store.error()).toBe(null);
  });

  it('should provide debug information', () => {
    const debugInfo = store.getDebugInfo();
    expect(debugInfo).toHaveProperty('flags');
    expect(debugInfo).toHaveProperty('remoteValues');
  });

  it('should handle loading state', () => {
    expect(store.loading()).toBe(false);
  });

  it('should handle error state', () => {
    expect(store.error()).toBe(null);
  });
});