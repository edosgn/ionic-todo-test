/**
 * Application Layer - Task Use Case Interfaces
 * 
 * These interfaces define the input and output contracts for task-related use cases.
 * They serve as DTOs (Data Transfer Objects) between the presentation and application layers.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { UseCaseError } from './common.interfaces';

/**
 * Input for creating a new task
 */
export interface CreateTaskInput {
  /** Title of the task (required) */
  title: string;
  
  /** Detailed description of the task (optional) */
  description?: string;
  
  /** Category ID to assign to the task (optional) */
  categoryId?: string;
}

/**
 * Input for updating an existing task
 */
export interface UpdateTaskInput {
  /** Unique identifier of the task to update */
  id: string;
  
  /** New title for the task (optional) */
  title?: string;
  
  /** New description for the task (optional) */
  description?: string;
  
  /** New category ID for the task (optional, null to unassign) */
  categoryId?: string | null;
}

/**
 * Input for completing/uncompleting a task
 */
export interface CompleteTaskInput {
  /** Unique identifier of the task */
  id: string;
  
  /** Whether to mark as completed (true) or incomplete (false) */
  completed: boolean;
}

/**
 * Input for filtering tasks by category
 */
export interface GetTasksByCategoryInput {
  /** Category ID to filter by */
  categoryId: string;
}

/**
 * Output for task operations (standardized task data)
 */
export interface TaskOutput {
  /** Unique identifier */
  id: string;
  
  /** Task title */
  title: string;
  
  /** Task description */
  description: string;
  
  /** Completion status */
  completed: boolean;
  
  /** Assigned category ID (null if no category) */
  categoryId: string | null;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
}



/**
 * Specific error for task not found scenarios
 */
export class TaskNotFoundError extends UseCaseError {
  constructor(taskId: string) {
    super(
      `Task with ID "${taskId}" not found`,
      'TASK_NOT_FOUND',
      { taskId }
    );
    this.name = 'TaskNotFoundError';
  }
}

/**
 * Specific error for validation failures
 */
export class TaskValidationError extends UseCaseError {
  constructor(field: string, value: any, reason: string) {
    super(
      `Validation failed for field "${field}": ${reason}`,
      'TASK_VALIDATION_ERROR',
      { field, value, reason }
    );
    this.name = 'TaskValidationError';
  }
}