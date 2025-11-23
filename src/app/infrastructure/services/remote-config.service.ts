import { Injectable, inject } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue, fetchConfig, activate } from '@angular/fire/remote-config';
import { environment } from '../../../environments/environment';

/**
 * Configuration value with metadata
 */
interface ConfigValue {
  value: string;
  source: string;
}

/**
 * Configuration values map
 */
interface ConfigValuesMap {
  [key: string]: ConfigValue | { error: string };
}

/**
 * RemoteConfigService
 * 
 * Service for managing Firebase Remote Config feature flags and configuration values.
 * This service provides a clean interface for fetching and accessing remote configuration
 * while handling errors gracefully with fallback values.
 * 
 * Architecture Layer: Infrastructure
 * Purpose: Adapter for Firebase Remote Config
 */
@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private initialized = false;

  constructor() {
    this.setupRemoteConfigSettings();
  }

  /**
   * Configure Remote Config settings based on environment
   */
  private setupRemoteConfigSettings(): void {
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: environment.remoteConfig.minimumFetchIntervalMillis,
      fetchTimeoutMillis: environment.remoteConfig.fetchTimeoutMillis,
    };

    // Set default values for Remote Config parameters
    this.remoteConfig.defaultConfig = {
      'enableCategories': true,
      'enableDeleteTask': true,
      'appTitle': 'Mis Tareas',
      'maxTasks': 200,
      'showStatistics': true,
      'theme_config': JSON.stringify({
        primaryColor: '#3880ff',
        accentColor: '#0cd1e8',
        darkMode: false
      })
    };
  }

  /**
   * Initialize Remote Config by fetching and activating the latest values
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🔥 Remote Config already initialized, skipping...');
      return;
    }

    try {
      console.log('🔥 Initializing Firebase Remote Config...');
      console.log('⚙️ Settings:', {
        minimumFetchIntervalMillis: environment.remoteConfig.minimumFetchIntervalMillis,
        fetchTimeoutMillis: environment.remoteConfig.fetchTimeoutMillis
      });
      
      await fetchAndActivate(this.remoteConfig);
      this.initialized = true;
      
      // Log current activated values to verify they're loaded
      console.log('✅ Firebase Remote Config initialized successfully');
      console.log('🔍 Verifying activated values:');
      
      const testValues = {
        appTitle: getValue(this.remoteConfig, 'appTitle').asString(),
        enableDeleteTask: getValue(this.remoteConfig, 'enableDeleteTask').asBoolean(),
        maxTasks: getValue(this.remoteConfig, 'maxTasks').asNumber(),
        showStatistics: getValue(this.remoteConfig, 'showStatistics').asBoolean()
      };
      
      console.log('📋 Current activated values:', testValues);
      
    } catch (error) {
      console.error('❌ Error initializing Remote Config:', error);
      console.log('🔄 Continuing with default values...');
      // Continue with default values
      this.initialized = true;
    }
  }

  /**
   * Get a feature flag value (boolean)
   * @param key The Remote Config key
   * @param defaultValue Default value if fetch fails
   */
  async getFeatureFlag(key: string, defaultValue = true): Promise<boolean> {
    await this.ensureInitialized();
    
    try {
      const value = getValue(this.remoteConfig, key);
      const boolValue = value.asBoolean();
      const source = value.getSource();
      console.log(`🏁 Feature flag '${key}': ${boolValue} [source: ${source}]`);
      return boolValue;
    } catch (error) {
      console.warn(`⚠️ Error getting feature flag '${key}', using default:`, defaultValue, error);
      return defaultValue;
    }
  }

  /**
   * Get a number value from Remote Config
   * @param key The Remote Config key
   * @param defaultValue Default value if fetch fails
   */
  async getNumberValue(key: string, defaultValue = 0): Promise<number> {
    await this.ensureInitialized();
    
    try {
      const value = getValue(this.remoteConfig, key);
      const numberValue = value.asNumber();
      const source = value.getSource();
      console.log(`🔢 Number value '${key}': ${numberValue} [source: ${source}]`);
      return numberValue;
    } catch (error) {
      console.warn(`⚠️ Error getting number value '${key}', using default:`, defaultValue, error);
      return defaultValue;
    }
  }

  /**
   * Get a string value from Remote Config
   * @param key The Remote Config key
   * @param defaultValue Default value if fetch fails
   */
  async getStringValue(key: string, defaultValue = ''): Promise<string> {
    await this.ensureInitialized();
    
    try {
      const value = getValue(this.remoteConfig, key);
      const stringValue = value.asString();
      const source = value.getSource();
      console.log(`📝 String value '${key}': "${stringValue}" [source: ${source}]`);
      return stringValue;
    } catch (error) {
      console.warn(`⚠️ Error getting string value '${key}', using default:`, defaultValue, error);
      return defaultValue;
    }
  }

  /**
   * Get a JSON object value from Remote Config
   * @param key The Remote Config key
   * @param defaultValue Default value if fetch fails
   */
  async getJsonValue<T>(key: string, defaultValue: T): Promise<T> {
    await this.ensureInitialized();
    
    try {
      const value = getValue(this.remoteConfig, key);
      const stringValue = value.asString();
      const jsonValue = JSON.parse(stringValue) as T;
      const source = value.getSource();
      console.log(`📦 JSON value '${key}':`, jsonValue, `[source: ${source}]`);
      return jsonValue;
    } catch (error) {
      console.warn(`⚠️ Error getting JSON value '${key}', using default:`, defaultValue, error);
      return defaultValue;
    }
  }

  /**
   * Force fetch the latest config from Firebase
   * Useful for testing or forcing updates
   */
  async forceFetch(): Promise<void> {
    try {
      console.log('🔄 Force fetching Remote Config...');
      await fetchConfig(this.remoteConfig);
      await activate(this.remoteConfig);
      console.log('✅ Remote Config force fetch completed');
    } catch (error) {
      console.error('❌ Error force fetching Remote Config:', error);
      throw error;
    }
  }

  /**
   * Get all active config values for debugging
   */
  getAllValues(): ConfigValuesMap {
    if (!this.initialized) {
      return {};
    }

    try {
      const keys = ['enableCategories', 'enableDeleteTask', 'remoteTitle', 'maxTasks', 'theme_config'];
      const values: ConfigValuesMap = {};
      
      keys.forEach(key => {
        try {
          const value = getValue(this.remoteConfig, key);
          values[key] = {
            value: value.asString(),
            source: value.getSource()
          };
        } catch (error) {
          values[key] = { error: (error as Error).message };
        }
      });

      return values;
    } catch (error) {
      console.error('Error getting all values:', error);
      return {};
    }
  }

  /**
   * Ensure Remote Config is initialized before operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}