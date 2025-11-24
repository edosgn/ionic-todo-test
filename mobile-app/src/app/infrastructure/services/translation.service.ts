/**
 * Translation Service
 * 
 * Infrastructure service for managing application translations.
 * Provides centralized access to translation strings with type safety.
 * Follows hexagonal architecture by implementing a translation port.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { TRANSLATIONS, TranslationUtils } from '../config/translations.config';

/**
 * Translation Service Interface (Port)
 * 
 * Defines the contract for translation services
 */
export interface ITranslationService {
  get(key: string, replacements?: (string | number)[]): string;
  getCommon(key: keyof typeof TRANSLATIONS.COMMON): string;
  getTasks(key: keyof typeof TRANSLATIONS.TASKS, replacements?: (string | number)[]): string;
  getCategories(key: keyof typeof TRANSLATIONS.CATEGORIES, replacements?: (string | number)[]): string;
  getForms(key: keyof typeof TRANSLATIONS.FORMS, replacements?: (string | number)[]): string;
  getDates(key: keyof typeof TRANSLATIONS.DATES, replacements?: (string | number)[]): string;
  getDialogs(key: keyof typeof TRANSLATIONS.DIALOGS): string;
  getAccessibility(key: keyof typeof TRANSLATIONS.ACCESSIBILITY, replacements?: (string | number)[]): string;
}

/**
 * Translation Service Implementation
 * 
 * Concrete implementation of the translation service interface.
 * Provides type-safe access to all application translations.
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService implements ITranslationService {

  /**
   * Get translation by key with optional placeholder replacements
   * 
   * @param key - Dot-separated translation key (e.g., 'TASKS.TITLE')
   * @param replacements - Array of values to replace placeholders {0}, {1}, etc.
   * @returns Translated string
   */
  get(key: string, replacements: (string | number)[] = []): string {
    const translation = TranslationUtils.getTranslation(key);
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Get common translation
   * 
   * @param key - Key from TRANSLATIONS.COMMON
   * @returns Translated string
   */
  getCommon(key: keyof typeof TRANSLATIONS.COMMON | string): string {
    return (TRANSLATIONS.COMMON as any)[key] || key;
  }

  /**
   * Get task-related translation
   * 
   * @param key - Key from TRANSLATIONS.TASKS
   * @param replacements - Optional placeholder replacements
   * @returns Translated string
   */
  getTasks(key: keyof typeof TRANSLATIONS.TASKS | string, replacements: (string | number)[] = []): string {
    const translation = (TRANSLATIONS.TASKS as any)[key] || key;
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Get category-related translation
   * 
   * @param key - Key from TRANSLATIONS.CATEGORIES
   * @param replacements - Optional placeholder replacements
   * @returns Translated string
   */
  getCategories(key: keyof typeof TRANSLATIONS.CATEGORIES | string, replacements: (string | number)[] = []): string {
    const translation = (TRANSLATIONS.CATEGORIES as any)[key] || key;
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Get form-related translation
   * 
   * @param key - Key from TRANSLATIONS.FORMS
   * @param replacements - Optional placeholder replacements
   * @returns Translated string
   */
  getForms(key: keyof typeof TRANSLATIONS.FORMS | string, replacements: (string | number)[] = []): string {
    const translation = (TRANSLATIONS.FORMS as any)[key] || key;
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Get date-related translation
   * 
   * @param key - Key from TRANSLATIONS.DATES
   * @param replacements - Optional placeholder replacements
   * @returns Translated string
   */
  getDates(key: keyof typeof TRANSLATIONS.DATES | string, replacements: (string | number)[] = []): string {
    const translation = (TRANSLATIONS.DATES as any)[key] || key;
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Get dialog-related translation
   * 
   * @param key - Key from TRANSLATIONS.DIALOGS
   * @returns Translated string
   */
  getDialogs(key: keyof typeof TRANSLATIONS.DIALOGS | string): string {
    return (TRANSLATIONS.DIALOGS as any)[key] || key;
  }

  /**
   * Get accessibility-related translation
   * 
   * @param key - Key from TRANSLATIONS.ACCESSIBILITY
   * @param replacements - Optional placeholder replacements
   * @returns Translated string
   */
  getAccessibility(key: keyof typeof TRANSLATIONS.ACCESSIBILITY | string, replacements: (string | number)[] = []): string {
    const translation = (TRANSLATIONS.ACCESSIBILITY as any)[key] || key;
    return replacements.length > 0 
      ? TranslationUtils.replacePlaceholders(translation, replacements)
      : translation;
  }

  /**
   * Convenience methods for commonly used patterns
   */
  
  /**
   * Get error message with optional context
   */
  getErrorMessage(operation: 'LOAD' | 'CREATE' | 'UPDATE' | 'DELETE', entity: 'TASKS' | 'CATEGORIES'): string {
    const key = `${operation}_ERROR` as keyof typeof TRANSLATIONS.TASKS | keyof typeof TRANSLATIONS.CATEGORIES;
    return entity === 'TASKS' 
      ? this.getTasks(key as keyof typeof TRANSLATIONS.TASKS)
      : this.getCategories(key as keyof typeof TRANSLATIONS.CATEGORIES);
  }

  /**
   * Get success message with optional context
   */
  getSuccessMessage(operation: 'CREATED' | 'UPDATED' | 'DELETED', entity: 'TASKS' | 'CATEGORIES'): string {
    const key = `${operation}_SUCCESS` as keyof typeof TRANSLATIONS.TASKS | keyof typeof TRANSLATIONS.CATEGORIES;
    return entity === 'TASKS'
      ? this.getTasks(key as keyof typeof TRANSLATIONS.TASKS)
      : this.getCategories(key as keyof typeof TRANSLATIONS.CATEGORIES);
  }

  /**
   * Get loading message
   */
  getLoadingMessage(operation: 'LOADING' | 'CREATING' | 'UPDATING' | 'DELETING', entity: 'TASKS' | 'CATEGORIES'): string {
    const key = `${operation}_${entity.slice(0, -1)}` as keyof typeof TRANSLATIONS.TASKS | keyof typeof TRANSLATIONS.CATEGORIES;
    return entity === 'TASKS'
      ? this.getTasks(key as keyof typeof TRANSLATIONS.TASKS)
      : this.getCategories(key as keyof typeof TRANSLATIONS.CATEGORIES);
  }

  /**
   * Get validation message
   */
  getValidationMessage(field: string, rule: 'REQUIRED' | 'MIN_LENGTH' | 'MAX_LENGTH', value?: number): string {
    switch (rule) {
      case 'REQUIRED':
        return this.getForms('REQUIRED_FIELD');
      case 'MIN_LENGTH':
        return this.getForms('MIN_LENGTH', [value || 0]);
      case 'MAX_LENGTH':
        return this.getForms('MAX_LENGTH', [value || 0]);
      default:
        return '';
    }
  }
}

/**
 * Translation Provider Token
 * 
 * Token for dependency injection of translation service
 */
export const TRANSLATION_SERVICE_TOKEN = Symbol('TranslationService');