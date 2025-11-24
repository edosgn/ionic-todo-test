import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

// Firebase imports - dynamic to avoid initialization issues
let firebaseApp: any = null;
let remoteConfigInstance: any = null;

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
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {}

  /**
   * Initialize Firebase and Remote Config dynamically
   */
  private async initializeFirebase(): Promise<void> {
    if (this.initialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔥 Initializing Firebase Remote Config...');
      
      // Dynamic import to avoid initialization issues
      const { initializeApp } = await import('firebase/app');
      const { getRemoteConfig } = await import('firebase/remote-config');
      
      if (!firebaseApp) {
        firebaseApp = initializeApp(environment.firebase);
      }
      
      if (!remoteConfigInstance) {
        remoteConfigInstance = getRemoteConfig(firebaseApp);
        remoteConfigInstance.settings = {
          minimumFetchIntervalMillis: environment.remoteConfig?.minimumFetchIntervalMillis || 3600000,
          fetchTimeoutMillis: environment.remoteConfig?.fetchTimeoutMillis || 60000,
        };

        // Set default values
        remoteConfigInstance.defaultConfig = {
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

      this.initialized = true;
      console.log('✅ Firebase Remote Config initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing Firebase Remote Config:', error);
      // Don't throw - allow app to continue with defaults
      this.initialized = false;
    }
  }

  /**
   * Initialize Remote Config and fetch latest values
   */
  async initialize(): Promise<void> {
    try {
      await this.initializeFirebase();
      
      if (this.initialized && remoteConfigInstance) {
        const { fetchAndActivate } = await import('firebase/remote-config');
        await fetchAndActivate(remoteConfigInstance);
      }
    } catch (error) {
      console.error('❌ Error during Remote Config initialization:', error);
      // Don't throw - app should continue with defaults
    }
  }

  /**
   * Get feature flag value with fallback
   */
  async getFeatureFlag(key: string, defaultValue: boolean): Promise<boolean> {
    try {
      await this.initializeFirebase();
      
      if (!this.initialized || !remoteConfigInstance) {
        console.log(`🏁 Feature flag '${key}': ${defaultValue} [source: default]`);
        return defaultValue;
      }

      const { getValue } = await import('firebase/remote-config');
      const value = getValue(remoteConfigInstance, key);
      const boolValue = value.asBoolean();
      const source = value.getSource();
      
      console.log(`🏁 Feature flag '${key}': ${boolValue} [source: ${source}]`);
      return boolValue;
      
    } catch (error: any) {
      console.error(`❌ Error getting feature flag '${key}':`, error);
      console.log(`🏁 Feature flag '${key}': ${defaultValue} [source: default]`);
      return defaultValue;
    }
  }

  /**
   * Get string value with fallback
   */
  async getStringValue(key: string, defaultValue: string): Promise<string> {
    try {
      await this.initializeFirebase();
      
      if (!this.initialized || !remoteConfigInstance) {
        console.log(`📝 String value '${key}': "${defaultValue}" [source: default]`);
        return defaultValue;
      }

      const { getValue } = await import('firebase/remote-config');
      const value = getValue(remoteConfigInstance, key);
      const stringValue = value.asString() || defaultValue;
      const source = value.getSource();
      
      console.log(`📝 String value '${key}': "${stringValue}" [source: ${source}]`);
      return stringValue;
      
    } catch (error: any) {
      console.error(`❌ Error getting string value '${key}':`, error);
      console.log(`📝 String value '${key}': "${defaultValue}" [source: default]`);
      return defaultValue;
    }
  }

  /**
   * Get number value with fallback
   */
  async getNumberValue(key: string, defaultValue: number): Promise<number> {
    try {
      await this.initializeFirebase();
      
      if (!this.initialized || !remoteConfigInstance) {
        console.log(`🔢 Number value '${key}': ${defaultValue} [source: default]`);
        return defaultValue;
      }

      const { getValue } = await import('firebase/remote-config');
      const value = getValue(remoteConfigInstance, key);
      const numberValue = value.asNumber() || defaultValue;
      const source = value.getSource();
      
      console.log(`🔢 Number value '${key}': ${numberValue} [source: ${source}]`);
      return numberValue;
      
    } catch (error: any) {
      console.error(`❌ Error getting number value '${key}':`, error);
      console.log(`🔢 Number value '${key}': ${defaultValue} [source: default]`);
      return defaultValue;
    }
  }

  /**
   * Force fetch new values from Remote Config
   */
  async forceFetch(): Promise<void> {
    try {
      await this.initializeFirebase();
      
      if (this.initialized && remoteConfigInstance) {
        const { fetchConfig, activate } = await import('firebase/remote-config');
        await fetchConfig(remoteConfigInstance);
        await activate(remoteConfigInstance);
        console.log('🔄 Remote Config values refreshed');
      }
    } catch (error: any) {
      console.error('❌ Error force fetching Remote Config:', error);
      throw error;
    }
  }

  /**
   * Get all current values (for debugging)
   */
  getAllValues(): any {
    try {
      if (!this.initialized || !remoteConfigInstance) {
        return {};
      }
      
      // Return a simple object for debugging
      return {
        initialized: this.initialized,
        hasRemoteConfig: !!remoteConfigInstance
      };
    } catch (error: any) {
      console.error('❌ Error getting all values:', error);
      return {};
    }
  }
}