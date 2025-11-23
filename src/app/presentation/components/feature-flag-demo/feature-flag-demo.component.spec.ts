import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureFlagDemoComponent } from './feature-flag-demo.component';
import { FeatureFlagStore } from '../../stores/feature-flag.store';
import { signal } from '@angular/core';

describe('FeatureFlagDemoComponent', () => {
  let component: FeatureFlagDemoComponent;
  let fixture: ComponentFixture<FeatureFlagDemoComponent>;
  let featureFlagStore: jest.Mocked<FeatureFlagStore>;
  let loadingSignal: ReturnType<typeof signal<boolean>>;
  let errorSignal: ReturnType<typeof signal<string | null>>;

  beforeEach(async () => {
    loadingSignal = signal(false);
    errorSignal = signal(null as string | null);

    const featureFlagStoreMock = {
      appTitle: signal('Test App'),
      maxTasksLimit: signal(10),
      deleteTaskEnabled: signal(true),
      statisticsVisible: signal(true),
      categoriesEnabled: signal(true),
      loading: loadingSignal.asReadonly(),
      error: errorSignal.asReadonly(),
      shouldShowCategories: jest.fn(() => true),
      shouldShowDeleteButton: jest.fn(() => true),
      getDebugInfo: jest.fn(() => ({
        appTitle: 'Test App',
        maxTasksLimit: 10,
        deleteTaskEnabled: true,
        statisticsVisible: true,
        categoriesEnabled: true,
      })),
      initializeFeatureFlags: jest.fn().mockResolvedValue(undefined),
      updateFeatureFlag: jest.fn(),
      resetToDefaults: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FeatureFlagDemoComponent],
      providers: [
        { provide: FeatureFlagStore, useValue: featureFlagStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureFlagDemoComponent);
    component = fixture.componentInstance;
    featureFlagStore = TestBed.inject(FeatureFlagStore) as jest.Mocked<FeatureFlagStore>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize feature flags on init', async () => {
    await component.ngOnInit();
    expect(featureFlagStore.initializeFeatureFlags).toHaveBeenCalled();
  });

  it('should display app title from store', () => {
    const cardTitle = fixture.nativeElement.querySelector('ion-card-title');
    expect(cardTitle.textContent.trim()).toBe('Test App');
  });

  it('should show loading state', () => {
    loadingSignal.set(true);
    fixture.detectChanges();
    
    const spinner = fixture.nativeElement.querySelector('ion-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error state', () => {
    errorSignal.set('Test error message');
    fixture.detectChanges();
    
    const errorItem = fixture.nativeElement.querySelector('ion-item[color="danger"]');
    expect(errorItem).toBeTruthy();
    expect(errorItem.textContent).toContain('Test error message');
  });
});
