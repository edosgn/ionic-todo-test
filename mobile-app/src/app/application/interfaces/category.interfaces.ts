/**
 * Application Layer - Category Use Case Interfaces
 * 
 * These interfaces define the input and output contracts for category-related use cases.
 * They serve as DTOs (Data Transfer Objects) between the presentation and application layers.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { UseCaseError } from './common.interfaces';

/**
 * Input for creating a new category
 */
export interface CreateCategoryInput {
  /** Name of the category (required) */
  name: string;
  
  /** Color in hex format (e.g., "#FF5733") (required) */
  color: string;
  
  /** Ionic icon name (optional, defaults to 'folder') */
  icon?: string;
}

/**
 * Input for updating an existing category
 */
export interface UpdateCategoryInput {
  /** Unique identifier of the category to update */
  id: string;
  
  /** New name for the category (optional) */
  name?: string;
  
  /** New color for the category (optional) */
  color?: string;
  
  /** New icon for the category (optional) */
  icon?: string;
}

/**
 * Output for category operations (standardized category data)
 */
export interface CategoryOutput {
  /** Unique identifier */
  id: string;
  
  /** Category name */
  name: string;
  
  /** Color in hex format */
  color: string;
  
  /** Ionic icon name */
  icon: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Result for category deletion (includes affected tasks count)
 */
export interface DeleteCategoryOutput {
  /** Whether the category was successfully deleted */
  success: boolean;
  
  /** Number of tasks that were unassigned from this category */
  affectedTasksCount: number;
  
  /** The deleted category's data */
  deletedCategory: CategoryOutput;
}

/**
 * Result for category statistics
 */
export interface CategoryStatsOutput {
  /** Total number of categories */
  totalCategories: number;
  
  /** Categories with task counts */
  categoriesWithTaskCounts: Array<{
    category: CategoryOutput;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  }>;
  
  /** Number of tasks without category assigned */
  unassignedTasks: number;
}

/**
 * Base error for category use case operations
 */
export class CategoryUseCaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'CategoryUseCaseError';
  }
}

/**
 * Specific error for category not found scenarios
 */
export class CategoryNotFoundError extends CategoryUseCaseError {
  constructor(categoryId: string) {
    super(
      `Category with ID "${categoryId}" not found`,
      'CATEGORY_NOT_FOUND',
      { categoryId }
    );
    this.name = 'CategoryNotFoundError';
  }
}

/**
 * Specific error for category validation failures
 */
export class CategoryValidationError extends CategoryUseCaseError {
  constructor(field: string, value: any, reason: string) {
    super(
      `Validation failed for field "${field}": ${reason}`,
      'CATEGORY_VALIDATION_ERROR',
      { field, value, reason }
    );
    this.name = 'CategoryValidationError';
  }
}

/**
 * Specific error for category deletion with assigned tasks
 */
export class CategoryHasTasksError extends CategoryUseCaseError {
  constructor(categoryId: string, taskCount: number) {
    super(
      `Cannot delete category "${categoryId}" because it has ${taskCount} assigned task(s)`,
      'CATEGORY_HAS_TASKS',
      { categoryId, taskCount }
    );
    this.name = 'CategoryHasTasksError';
  }
}

/**
 * Specific error for duplicate category names
 */
export class DuplicateCategoryNameError extends CategoryUseCaseError {
  constructor(name: string) {
    super(
      `Category with name "${name}" already exists`,
      'DUPLICATE_CATEGORY_NAME',
      { name }
    );
    this.name = 'DuplicateCategoryNameError';
  }
}