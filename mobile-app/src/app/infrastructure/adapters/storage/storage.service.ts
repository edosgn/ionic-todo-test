/**
 * Storage Service - Data persistence abstraction
 * 
 * Provides a unified interface for data storage that can work with both
 * Cordova's NativeStorage and browser localStorage as fallback.
 * This follows the Adapter pattern to abstract storage implementation details.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

declare var window: any;

/**
 * Storage interface for type safety
 */
export interface StorageInterface {
  get<T>(key: string): Observable<T | null>;
  set<T>(key: string, value: T): Observable<void>;
  remove(key: string): Observable<void>;
  clear(): Observable<void>;
  keys(): Observable<string[]>;
  has(key: string): Observable<boolean>;
}

/**
 * Storage service that abstracts data persistence
 * Uses Cordova NativeStorage when available, falls back to localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageInterface {
  private nativeStorage: any;
  private isNativeStorageAvailable = false;
  private readonly STORAGE_PREFIX = 'ionic_todo_';

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage backend (native or localStorage)
   */
  private initializeStorage(): void {
    try {
      // Check if we're in Cordova environment
      if (window && window.NativeStorage) {
        this.nativeStorage = window.NativeStorage;
        this.isNativeStorageAvailable = true;
        console.log('StorageService: Using NativeStorage');
      } else {
        console.log('StorageService: Using localStorage fallback');
      }
    } catch (error) {
      console.warn('StorageService: NativeStorage not available, using localStorage', error);
    }
  }

  /**
   * Get a value from storage by key
   * 
   * @param key - Storage key
   * @returns Observable with the value or null if not found
   */
  get<T>(key: string): Observable<T | null> {
    const fullKey = this.getFullKey(key);

    if (this.isNativeStorageAvailable) {
      return this.getNativeStorage<T>(fullKey);
    } else {
      return this.getLocalStorage<T>(fullKey);
    }
  }

  /**
   * Set a value in storage
   * 
   * @param key - Storage key
   * @param value - Value to store
   * @returns Observable that completes when stored
   */
  set<T>(key: string, value: T): Observable<void> {
    const fullKey = this.getFullKey(key);

    if (this.isNativeStorageAvailable) {
      return this.setNativeStorage(fullKey, value);
    } else {
      return this.setLocalStorage(fullKey, value);
    }
  }

  /**
   * Remove a value from storage
   * 
   * @param key - Storage key to remove
   * @returns Observable that completes when removed
   */
  remove(key: string): Observable<void> {
    const fullKey = this.getFullKey(key);

    if (this.isNativeStorageAvailable) {
      return this.removeNativeStorage(fullKey);
    } else {
      return this.removeLocalStorage(fullKey);
    }
  }

  /**
   * Clear all app data from storage
   * 
   * @returns Observable that completes when cleared
   */
  clear(): Observable<void> {
    if (this.isNativeStorageAvailable) {
      // For native storage, we need to get all keys first and remove them
      return this.keys().pipe(
        map(keys => {
          const promises = keys.map(key => 
            new Promise<void>((resolve) => {
              this.nativeStorage.remove(key, resolve, resolve);
            })
          );
          return Promise.all(promises);
        }),
        map(() => void 0)
      );
    } else {
      return this.clearLocalStorage();
    }
  }

  /**
   * Get all storage keys for this app
   * 
   * @returns Observable with array of keys
   */
  keys(): Observable<string[]> {
    if (this.isNativeStorageAvailable) {
      // NativeStorage doesn't provide a keys() method, so we track keys manually
      return this.getLocalStorage<string[]>('__storage_keys__').pipe(
        map(keys => keys || [])
      );
    } else {
      return this.getLocalStorageKeys();
    }
  }

  /**
   * Check if a key exists in storage
   * 
   * @param key - Storage key to check
   * @returns Observable with boolean result
   */
  has(key: string): Observable<boolean> {
    return this.get(key).pipe(
      map(value => value !== null),
      catchError(() => of(false))
    );
  }

  // Private methods for NativeStorage operations

  private getNativeStorage<T>(key: string): Observable<T | null> {
    return new Observable(observer => {
      this.nativeStorage.getItem(
        key,
        (data: T) => {
          observer.next(data);
          observer.complete();
        },
        (error: any) => {
          if (error && error.code === 2) { // Item not found
            observer.next(null);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      );
    });
  }

  private setNativeStorage<T>(key: string, value: T): Observable<void> {
    return new Observable(observer => {
      this.nativeStorage.setItem(
        key,
        value,
        () => {
          this.updateStorageKeys(key);
          observer.next();
          observer.complete();
        },
        (error: any) => observer.error(error)
      );
    });
  }

  private removeNativeStorage(key: string): Observable<void> {
    return new Observable(observer => {
      this.nativeStorage.remove(
        key,
        () => {
          this.removeFromStorageKeys(key);
          observer.next();
          observer.complete();
        },
        (error: any) => {
          // Consider remove successful even if key doesn't exist
          observer.next();
          observer.complete();
        }
      );
    });
  }

  // Private methods for localStorage operations

  private getLocalStorage<T>(key: string): Observable<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return of(null);
      }
      const parsed = JSON.parse(item);
      return of(parsed);
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return of(null);
    }
  }

  private setLocalStorage<T>(key: string, value: T): Observable<void> {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return of(void 0);
    } catch (error) {
      console.error('Error setting localStorage:', error);
      return throwError(() => error);
    }
  }

  private removeLocalStorage(key: string): Observable<void> {
    try {
      localStorage.removeItem(key);
      return of(void 0);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return throwError(() => error);
    }
  }

  private clearLocalStorage(): Observable<void> {
    try {
      // Only clear items with our prefix
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return of(void 0);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return throwError(() => error);
    }
  }

  private getLocalStorageKeys(): Observable<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keys.push(key.replace(this.STORAGE_PREFIX, ''));
        }
      }
      return of(keys);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return of([]);
    }
  }

  // Helper methods

  private getFullKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`;
  }

  private updateStorageKeys(key: string): void {
    // Track keys for NativeStorage since it doesn't provide keys() method
    if (this.isNativeStorageAvailable) {
      this.getLocalStorage<string[]>('__storage_keys__').subscribe(keys => {
        const keyList = keys || [];
        const shortKey = key.replace(this.STORAGE_PREFIX, '');
        if (!keyList.includes(shortKey)) {
          keyList.push(shortKey);
          this.setLocalStorage('__storage_keys__', keyList).subscribe();
        }
      });
    }
  }

  private removeFromStorageKeys(key: string): void {
    if (this.isNativeStorageAvailable) {
      this.getLocalStorage<string[]>('__storage_keys__').subscribe(keys => {
        const keyList = keys || [];
        const shortKey = key.replace(this.STORAGE_PREFIX, '');
        const index = keyList.indexOf(shortKey);
        if (index > -1) {
          keyList.splice(index, 1);
          this.setLocalStorage('__storage_keys__', keyList).subscribe();
        }
      });
    }
  }

  /**
   * Utility method to check if running in Cordova environment
   */
  isCordova(): boolean {
    return this.isNativeStorageAvailable;
  }

  /**
   * Get storage statistics for debugging
   */
  getStorageInfo(): Observable<{
    type: 'native' | 'localStorage';
    keysCount: number;
    keys: string[];
  }> {
    return this.keys().pipe(
      map(keys => ({
        type: this.isNativeStorageAvailable ? 'native' : 'localStorage',
        keysCount: keys.length,
        keys
      }))
    );
  }
}