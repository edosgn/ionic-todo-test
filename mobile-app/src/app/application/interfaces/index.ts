/**
 * Application Layer - Interfaces Barrel Export
 * 
 * Centralizes all interface exports from the application layer
 * for easy importing throughout the application.
 */

// Common interfaces (base exports)
export * from './common.interfaces';

// Task interfaces (excluding conflicting exports)
export {
  CreateTaskInput,
  UpdateTaskInput,
  CompleteTaskInput,
  GetTasksByCategoryInput,
  TaskOutput,
  TaskNotFoundError,
  TaskValidationError
} from './task.interfaces';

// Category interfaces (excluding conflicting exports)
export {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryOutput,
  DeleteCategoryOutput,
  CategoryStatsOutput,
  CategoryNotFoundError,
  CategoryValidationError,
  CategoryHasTasksError,
  DuplicateCategoryNameError
} from './category.interfaces';