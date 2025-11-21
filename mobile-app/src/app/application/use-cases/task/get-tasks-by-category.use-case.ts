/**
 * GetTasksByCategoryUseCase - Retrieves tasks filtered by category
 * 
 * This use case handles the retrieval of tasks belonging to a specific category.
 * It includes validation and supports querying uncategorized tasks.
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
  GetTasksByCategoryInput, 
  TaskOutput, 
  UseCase,
  CategoryNotFoundError 
} from '../../interfaces';

/**
 * Use case for retrieving tasks by category
 */
@Injectable({
  providedIn: 'root'
})
export class GetTasksByCategoryUseCase implements UseCase<GetTasksByCategoryInput, TaskOutput[]> {
  
  constructor(
    private taskRepository: TaskRepository,
    private categoryRepository: CategoryRepository
  ) {}

  /**
   * Executes the get tasks by category use case
   * 
   * @param input - The category filter parameters
   * @returns Observable that emits tasks filtered by category
   * @throws CategoryNotFoundError if category doesn't exist
   */
  execute(input: GetTasksByCategoryInput): Observable<TaskOutput[]> {
    this.validateInput(input);
    
    // Special case: if categoryId is 'uncategorized', get tasks without category
    if (input.categoryId === 'uncategorized') {
      return this.getUncategorizedTasks();
    }
    
    // Validate category exists before querying tasks
    return this.categoryRepository.findById(input.categoryId).pipe(
      switchMap(category => {
        if (!category) {
          return throwError(() => new CategoryNotFoundError(input.categoryId));
        }
        
        return this.taskRepository.findByCategory(input.categoryId).pipe(
          map(tasks => tasks.map(task => this.mapTaskToOutput(task)))
        );
      })
    );
  }

  /**
   * Gets tasks that don't have any category assigned
   */
  private getUncategorizedTasks(): Observable<TaskOutput[]> {
    return this.taskRepository.findAll().pipe(
      map(tasks => 
        tasks
          .filter(task => task.categoryId === null)
          .map(task => this.mapTaskToOutput(task))
      )
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: GetTasksByCategoryInput): void {
    if (!input) {
      throw new Error('Input is required');
    }

    if (!input.categoryId || input.categoryId.trim().length === 0) {
      throw new Error('Category ID is required');
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