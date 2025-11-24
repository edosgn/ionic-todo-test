/**
 * ThemeService - Service for managing app theme (dark/light mode)
 * 
 * Handles theme switching and persists user preference.
 * Integrates with Ionic's color mode system.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable, signal, effect, inject, Injector, runInInjectionContext, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme-preference';
  private readonly injector = inject(Injector);
  
  // Current theme mode signal
  private readonly _themeMode = signal<ThemeMode>('auto');
  
  // Public readonly signal
  readonly themeMode = this._themeMode.asReadonly();

  constructor() {
    // Load saved theme preference on init
    this.loadThemePreference();
    
    // Apply theme whenever it changes
    // Use runInInjectionContext to ensure effect works in all scenarios
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const mode = this._themeMode();
        this.applyTheme(mode);
      });
    });
  }

  /**
   * Initialize theme from stored preference or system preference
   */
  private loadThemePreference(): void {
    try {
      const stored = localStorage.getItem(this.THEME_KEY) as ThemeMode;
      if (stored && ['light', 'dark', 'auto'].includes(stored)) {
        this._themeMode.set(stored);
      } else {
        // Default to auto (follows system preference)
        this._themeMode.set('auto');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      this._themeMode.set('auto');
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(mode: ThemeMode): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    let shouldUseDark = false;
    
    switch (mode) {
      case 'dark':
        shouldUseDark = true;
        break;
      case 'light':
        shouldUseDark = false;
        break;
      case 'auto':
        shouldUseDark = prefersDark.matches;
        break;
    }

    // Toggle dark mode on document body
    document.body.classList.toggle('dark', shouldUseDark);
    
    // Set color-scheme meta tag for better system integration
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', shouldUseDark ? '#1a1a1a' : '#ffffff');
    }

    console.log(`🎨 Theme applied: ${mode} (dark=${shouldUseDark})`);
  }

  /**
   * Set theme mode and persist preference
   */
  setThemeMode(mode: ThemeMode): void {
    try {
      this._themeMode.set(mode);
      localStorage.setItem(this.THEME_KEY, mode);
      console.log(`💾 Theme preference saved: ${mode}`);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  /**
   * Toggle between light and dark (ignoring auto)
   */
  toggleTheme(): void {
    const current = this._themeMode();
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.setThemeMode(next);
  }

  /**
   * Check if dark mode is currently active (computed signal)
   */
  readonly isDarkMode = computed(() => {
    const mode = this._themeMode();
    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  });
}
