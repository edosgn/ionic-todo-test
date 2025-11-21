/**
 * DeleteTaskUseCase - Deletes an existing task
 * 
 * This use case handles the deletion of tasks with validation.
 * It follows the Command pattern and includes proper error handling.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError, of } from 'rxjs';

// Domain imports
import { TaskRepository } from '../../../domain';

// Application imports
import { 
  VoidUseCase,
  TaskNotFoundError 
} from '../../interfaces';

/**
 * Input for deleting a task
 */
export interface DeleteTaskInput {
  /** The unique identifier of the task to delete */
  id: string;
}

/**
 * Use case for deleting a task
 */
@Injectable({
  providedIn: 'root'
})
export class DeleteTaskUseCase implements VoidUseCase<DeleteTaskInput> {
  
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Executes the task deletion use case
   * 
   * @param input - The task deletion parameters
   * @returns Observable that completes when task is deleted
   * @throws TaskNotFoundError if task doesn't exist
   */
  execute(input: DeleteTaskInput): Observable<void> {
    this.validateInput(input);
    
    return this.taskRepository.findById(input.id).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundError(input.id));
        }
        
        return this.taskRepository.delete(input.id);
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: DeleteTaskInput): void {
    if (!input) {
      throw new Error('Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new Error('Task ID is required');
    }
  }
}