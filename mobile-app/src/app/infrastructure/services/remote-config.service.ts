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
      'remoteTitle': 'Mis Tareas',
      'maxTasks': 200,
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
      return;
    }

    try {
      console.log('🔥 Initializing Firebase Remote Config...');
      await fetchAndActivate(this.remoteConfig);
      this.initialized = true;
      console.log('✅ Firebase Remote Config initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Remote Config:', error);
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
      console.log(`🏁 Feature flag '${key}': ${boolValue}`);
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
      console.log(`🔢 Number value '${key}': ${numberValue}`);
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
      console.log(`📝 String value '${key}': ${stringValue}`);
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
      console.log(`📦 JSON value '${key}':`, jsonValue);
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