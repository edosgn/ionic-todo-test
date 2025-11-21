/**
 * CompleteTaskUseCase - Marks a task as completed or incomplete
 * 
 * This use case handles toggling the completion status of tasks.
 * It follows the Command pattern and includes business logic validation.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';

// Domain imports
import { TaskRepository } from '../../../domain';

// Application imports
import { 
  CompleteTaskInput, 
  TaskOutput, 
  UseCase,
  TaskNotFoundError 
} from '../../interfaces';

/**
 * Use case for completing/uncompleting a task
 */
@Injectable({
  providedIn: 'root'
})
export class CompleteTaskUseCase implements UseCase<CompleteTaskInput, TaskOutput> {
  
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Executes the task completion use case
   * 
   * @param input - The task completion parameters
   * @returns Observable that emits the updated task
   * @throws TaskNotFoundError if task doesn't exist
   */
  execute(input: CompleteTaskInput): Observable<TaskOutput> {
    this.validateInput(input);
    
    return this.taskRepository.findById(input.id).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundError(input.id));
        }

        // Use domain methods to maintain business logic
        if (input.completed) {
          task.complete();
        } else {
          task.uncomplete();
        }

        // Save updated task
        return this.taskRepository.update(task).pipe(
          map(updatedTask => this.mapTaskToOutput(updatedTask))
        );
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: CompleteTaskInput): void {
    if (!input) {
      throw new Error('Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    if (input.completed === undefined || input.completed === null) {
      throw new Error('Completed status is required');
    }
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