/**
 * UpdateTaskUseCase - Updates an existing task
 * 
 * This use case handles the update of task properties with validation
 * and business rules. It follows the Command pattern.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';

// Domain imports
import { TaskRepository, CategoryRepository } from '../../../domain';

// Application imports
import { 
  UpdateTaskInput, 
  TaskOutput, 
  UseCase,
  TaskValidationError,
  TaskNotFoundError,
  CategoryNotFoundError 
} from '../../interfaces';

/**
 * Use case for updating an existing task
 */
@Injectable({
  providedIn: 'root'
})
export class UpdateTaskUseCase implements UseCase<UpdateTaskInput, TaskOutput> {
  
  constructor(
    private taskRepository: TaskRepository,
    private categoryRepository: CategoryRepository
  ) {}

  /**
   * Executes the task update use case
   * 
   * @param input - The task update parameters
   * @returns Observable that emits the updated task
   * @throws TaskNotFoundError if task doesn't exist
   * @throws CategoryNotFoundError if specified category doesn't exist
   * @throws TaskValidationError if validation fails
   */
  execute(input: UpdateTaskInput): Observable<TaskOutput> {
    this.validateInput(input);
    
    return this.taskRepository.findById(input.id).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundError(input.id));
        }

        // Validate category if being changed
        if (input.categoryId !== undefined && input.categoryId !== null) {
          return this.validateCategoryExists(input.categoryId).pipe(
            switchMap(() => this.updateTask(task, input))
          );
        } else {
          return this.updateTask(task, input);
        }
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: UpdateTaskInput): void {
    if (!input) {
      throw new TaskValidationError('input', input, 'Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new TaskValidationError('id', input.id, 'Task ID is required');
    }

    if (input.title !== undefined) {
      if (input.title.trim().length === 0) {
        throw new TaskValidationError('title', input.title, 'Title cannot be empty');
      }

      if (input.title.trim().length > 200) {
        throw new TaskValidationError('title', input.title, 'Title cannot exceed 200 characters');
      }
    }

    if (input.description !== undefined && input.description.length > 1000) {
      throw new TaskValidationError('description', input.description, 'Description cannot exceed 1000 characters');
    }
  }

  /**
   * Validates that the specified category exists
   */
  private validateCategoryExists(categoryId: string): Observable<void> {
    return this.categoryRepository.findById(categoryId).pipe(
      map(category => {
        if (!category) {
          throw new CategoryNotFoundError(categoryId);
        }
        return void 0;
      })
    );
  }

  /**
   * Updates the task with new values
   */
  private updateTask(task: any, input: UpdateTaskInput): Observable<TaskOutput> {
    // Update properties only if they're provided
    if (input.title !== undefined) {
      task.title = input.title.trim();
    }

    if (input.description !== undefined) {
      task.description = input.description.trim();
    }

    if (input.categoryId !== undefined) {
      if (input.categoryId === null) {
        task.removeCategory();
      } else {
        task.assignCategory(input.categoryId);
      }
    }

    // Update timestamp
    task.updatedAt = new Date();

    // Save updated task
    return this.taskRepository.update(task).pipe(
      map(updatedTask => this.mapTaskToOutput(updatedTask))
    );
  }

  /**
   * Maps a Task entity to TaskOutput DTO
   */
  private mapTaskToOutput(task: any): TaskOutput {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      categoryId: task.categoryId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }
}