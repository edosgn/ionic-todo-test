/**
 * CreateTaskUseCase - Creates a new task
 * 
 * This use case handles the creation of new tasks with validation and business rules.
 * It follows the Command pattern and implements business logic for task creation.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';

// Domain imports
import { Task, TaskRepository, CategoryRepository, TaskId } from '../../../domain';

// Application imports
import { 
  CreateTaskInput, 
  TaskOutput, 
  UseCase,
  TaskValidationError,
  CategoryNotFoundError 
} from '../../interfaces';

/**
 * Use case for creating a new task
 */
@Injectable({
  providedIn: 'root'
})
export class CreateTaskUseCase implements UseCase<CreateTaskInput, TaskOutput> {
  
  constructor(
    private taskRepository: TaskRepository,
    private categoryRepository: CategoryRepository
  ) {}

  /**
   * Executes the task creation use case
   * 
   * @param input - The task creation parameters
   * @returns Observable that emits the created task
   * @throws TaskValidationError if validation fails
   * @throws CategoryNotFoundError if specified category doesn't exist
   */
  execute(input: CreateTaskInput): Observable<TaskOutput> {
    // Validate input
    this.validateInput(input);
    
    // If category is specified, validate it exists
    if (input.categoryId) {
      return this.validateCategoryExists(input.categoryId).pipe(
        switchMap(() => this.createAndSaveTask(input))
      );
    } else {
      return this.createAndSaveTask(input);
    }
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: CreateTaskInput): void {
    if (!input) {
      throw new TaskValidationError('input', input, 'Input is required');
    }

    if (!input.title || input.title.trim().length === 0) {
      throw new TaskValidationError('title', input.title, 'Title is required and cannot be empty');
    }

    if (input.title.trim().length > 200) {
      throw new TaskValidationError('title', input.title, 'Title cannot exceed 200 characters');
    }

    if (input.description && input.description.length > 1000) {
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
   * Creates and saves the new task
   */
  private createAndSaveTask(input: CreateTaskInput): Observable<TaskOutput> {
    // Generate unique ID for the new task
    const taskId = TaskId.generate();
    
    // Create new task entity using static factory method
    const task = Task.create(
      taskId.getValue(),
      input.title.trim(),
      input.description?.trim() || '',
      input.categoryId
    );

    // Save task and return as output DTO
    return this.taskRepository.save(task).pipe(
      map(savedTask => this.mapTaskToOutput(savedTask))
    );
  }

  /**
   * Maps a Task entity to TaskOutput DTO
   */
  private mapTaskToOutput(task: Task): TaskOutput {
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