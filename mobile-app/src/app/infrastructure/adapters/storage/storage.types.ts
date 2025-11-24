/**
 * Infrastructure Layer - DTOs for Data Storage
 * 
 * Data Transfer Objects used for serialization and storage.
 * These represent the data structure used in the persistence layer.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

/**
 * Task DTO for storage serialization
 */
export interface TaskDTO {
  /** Unique identifier */
  id: string;
  
  /** Task title */
  title: string;
  
  /** Task description */
  description: string;
  
  /** Whether the task is completed */
  completed: boolean;
  
  /** ID of assigned category (null if no category) */
  categoryId: string | null;
  
  /** Creation timestamp (ISO string) */
  createdAt: string;
  
  /** Last update timestamp (ISO string) */
  updatedAt: string;
}

/**
 * Category DTO for storage serialization
 */
export interface CategoryDTO {
  /** Unique identifier */
  id: string;
  
  /** Category name */
  name: string;
  
  /** Color in hex format */
  color: string;
  
  /** Ionic icon name */
  icon: string;
  
  /** Creation timestamp (ISO string) */
  createdAt: string;
  
  /** Last update timestamp (ISO string) */
  updatedAt: string;
}

/**
 * Storage collections structure
 */
export interface StorageCollections {
  tasks: TaskDTO[];
  categories: CategoryDTO[];
}

/**
 * Storage metadata for versioning and migrations
 */
export interface StorageMetadata {
  /** Schema version */
  version: string;
  
  /** Last migration timestamp */
  lastMigration: string;
  
  /** App version when data was created */
  appVersion: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  /** Tasks collection */
  TASKS: 'tasks',
  
  /** Categories collection */
  CATEGORIES: 'categories',
  
  /** Storage metadata */
  METADATA: 'metadata',
  
  /** User preferences */
  USER_PREFERENCES: 'user_preferences',
  
  /** App settings */
  APP_SETTINGS: 'app_settings'
} as const;

/**
 * Type for storage keys
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Default storage metadata
 */
export const DEFAULT_STORAGE_METADATA: StorageMetadata = {
  version: '1.0.0',
  lastMigration: new Date().toISOString(),
  appVersion: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Default empty collections
 */
export const DEFAULT_COLLECTIONS: StorageCollections = {
  tasks: [],
  categories: []
};