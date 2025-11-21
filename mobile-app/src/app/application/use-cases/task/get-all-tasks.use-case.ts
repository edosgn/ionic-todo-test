/**
 * GetAllTasksUseCase - Retrieves all tasks
 * 
 * This use case handles the retrieval of all tasks with optional sorting and filtering.
 * It follows the Query pattern and provides data for read operations.
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
  NoInputUseCase 
} from '../../interfaces';

/**
 * Use case for retrieving all tasks
 */
@Injectable({
  providedIn: 'root'
})
export class GetAllTasksUseCase implements NoInputUseCase<TaskOutput[]> {
  
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Executes the get all tasks use case
   * 
   * @returns Observable that emits an array of all tasks
   */
  execute(): Observable<TaskOutput[]> {
    return this.taskRepository.findAll().pipe(
      map(tasks => tasks.map(task => this.mapTaskToOutput(task)))
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