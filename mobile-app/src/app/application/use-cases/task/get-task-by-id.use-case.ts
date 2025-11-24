/**
 * GetTaskByIdUseCase - Retrieves a specific task by its ID
 * 
 * This use case handles the retrieval of a single task using its unique identifier.
 * It includes validation and error handling for non-existent tasks.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Domain imports
import { TaskRepository } from '../../../domain';

// Application imports
import { 
  TaskOutput, 
  UseCase,
  TaskNotFoundError 
} from '../../interfaces';

/**
 * Input for getting a task by ID
 */
export interface GetTaskByIdInput {
  /** The unique identifier of the task to retrieve */
  id: string;
}

/**
 * Use case for retrieving a task by its ID
 */
@Injectable({
  providedIn: 'root'
})
export class GetTaskByIdUseCase implements UseCase<GetTaskByIdInput, TaskOutput> {
  
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Executes the get task by ID use case
   * 
   * @param input - The task ID parameters
   * @returns Observable that emits the found task
   * @throws TaskNotFoundError if task doesn't exist
   */
  execute(input: GetTaskByIdInput): Observable<TaskOutput> {
    this.validateInput(input);
    
    return this.taskRepository.findById(input.id).pipe(
      map(task => {
        if (!task) {
          throw new TaskNotFoundError(input.id);
        }
        return this.mapTaskToOutput(task);
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: GetTaskByIdInput): void {
    if (!input) {
      throw new Error('Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new Error('Task ID is required');
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