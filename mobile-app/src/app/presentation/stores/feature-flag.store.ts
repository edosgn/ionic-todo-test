import { Injectable, signal, computed, inject } from '@angular/core';
import { RemoteConfigService } from '../../infrastructure/services/remote-config.service';

/**
 * Feature Flags interface - Updated to match Firebase Remote Config
 */
export interface FeatureFlags {
  enableCategories: boolean;      // enableCategories from Firebase
  enableDeleteTask: boolean;      // enableDeleteTask from Firebase
  appTitle: string;              // appTitle from Firebase (remote app title)
  maxTasks: number;              // maxTasks from Firebase
  showStatistics: boolean;       // showStatistics from Firebase (show/hide statistics section)
  themeConfig: ThemeConfig;      // Keep existing theme config
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
}

/**
 * Default feature flags values
 */
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableCategories: true,
  enableDeleteTask: true,
  appTitle: "Mis Tareas",
  maxTasks: 200,
  showStatistics: true,
  themeConfig: {
    primaryColor: '#3880ff',
    accentColor: '#0cd1e8',
    darkMode: false
  }
};

/**
 * FeatureFlagStore
 * 
 * Reactive store for managing Firebase Remote Config feature flags.
 * Provides computed selectors for feature flags and handles initialization.
 * 
 * Architecture Layer: Presentation
 * Purpose: Reactive state management for feature flags
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagStore {
  private readonly remoteConfigService = inject(RemoteConfigService);

  // Private signals for internal state
  private readonly _featureFlags = signal<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _initialized = signal<boolean>(false);

  // Public readonly signals
  readonly featureFlags = this._featureFlags.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly initialized = this._initialized.asReadonly();

  // Computed selectors for specific features
  readonly categoriesEnabled = computed(() => this._featureFlags().enableCategories);
  readonly deleteTaskEnabled = computed(() => this._featureFlags().enableDeleteTask);
  readonly appTitle = computed(() => this._featureFlags().appTitle);
  readonly maxTasksLimit = computed(() => this._featureFlags().maxTasks);
  readonly statisticsVisible = computed(() => this._featureFlags().showStatistics);
  readonly themeConfig = computed(() => this._featureFlags().themeConfig);

  // Computed selector for UI conditional rendering
  readonly shouldShowCategories = computed(() => 
    this._featureFlags().enableCategories && this._initialized()
  );

  readonly shouldShowDeleteButton = computed(() => 
    this._featureFlags().enableDeleteTask && this._initialized()
  );

  /**
   * Initialize feature flags from Remote Config
   */
  async initializeFeatureFlags(): Promise<void> {
    if (this._initialized()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      console.log('🏁 Initializing Feature Flags Store...');
      
      // Add a timeout to prevent infinite blocking
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Firebase initialization timeout')), 8000)
      );

      // Race between Firebase initialization and timeout
      await Promise.race([
        this.remoteConfigService.initialize(),
        timeoutPromise
      ]);

      // Fetch all feature flags with timeout
      const fetchPromise = Promise.all([
        this.remoteConfigService.getFeatureFlag('enableCategories', true),
        this.remoteConfigService.getFeatureFlag('enableDeleteTask', true),
        this.remoteConfigService.getStringValue('appTitle', 'Mis Tareas'),
        this.remoteConfigService.getNumberValue('maxTasks', 200),
        this.remoteConfigService.getFeatureFlag('showStatistics', true),
        this.remoteConfigService.getStringValue('theme_config', JSON.stringify(DEFAULT_FEATURE_FLAGS.themeConfig))
      ]);

      const fetchTimeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Feature flags fetch timeout')), 5000)
      );

      const [
        enableCategories,
        enableDeleteTask,
        appTitle,
        maxTasks,
        showStatistics,
        themeConfigString
      ] = await Promise.race([fetchPromise, fetchTimeoutPromise]);

      // Parse theme config
      let themeConfig: ThemeConfig;
      try {
        themeConfig = JSON.parse(themeConfigString);
      } catch {
        themeConfig = DEFAULT_FEATURE_FLAGS.themeConfig;
      }

      // Update feature flags
      const newFeatureFlags: FeatureFlags = {
        enableCategories,
        enableDeleteTask,
        appTitle,
        maxTasks,
        showStatistics,
        themeConfig
      };

      this._featureFlags.set(newFeatureFlags);
      this._initialized.set(true);
      this._loading.set(false);

      console.log('✅ Feature flags initialized:', newFeatureFlags);

    } catch (error) {
      console.error('❌ Error initializing feature flags:', error);
      this._error.set(`Failed to initialize feature flags: ${error}`);
      this._loading.set(false);
      
      // Keep default values but mark as initialized to prevent infinite retries
      this._initialized.set(true);
      console.log('🔄 Using default feature flags due to initialization error');
    }
  }

  /**
   * Force refresh feature flags from Remote Config
   * Useful for testing feature flag updates
   */
  async refreshFeatureFlags(): Promise<void> {
    console.log('🔄 Refreshing feature flags...');
    
    this._loading.set(true);
    this._error.set(null);

    try {
      // Force fetch from Remote Config
      await this.remoteConfigService.forceFetch();
      
      // Reset initialization flag to force re-fetch
      this._initialized.set(false);
      
      // Re-initialize
      await this.initializeFeatureFlags();
      
      console.log('✅ Feature flags refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing feature flags:', error);
      this._error.set(`Failed to refresh feature flags: ${error}`);
      this._loading.set(false);
    }
  }

  /**
   * Get current feature flag values for debugging
   */
  getDebugInfo(): { flags: FeatureFlags; remoteValues: unknown } {
    return {
      flags: this._featureFlags(),
      remoteValues: this.remoteConfigService.getAllValues()
    };
  }

  /**
   * Reset feature flags to default values
   * Useful for testing or fallback scenarios
   */
  resetToDefaults(): void {
    console.log('🔄 Resetting feature flags to defaults');
    this._featureFlags.set({ ...DEFAULT_FEATURE_FLAGS });
    this._error.set(null);
  }
}