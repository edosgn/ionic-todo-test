/**
 * DeleteCategoryUseCase - Deletes an existing category
 * 
 * This use case handles the deletion of categories with validation
 * and business rules. It unassigns all tasks from the category before deletion.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, throwError, forkJoin } from 'rxjs';

// Domain imports
import { CategoryRepository, TaskRepository } from '../../../domain';

// Application imports
import { 
  DeleteCategoryOutput, 
  UseCase,
  CategoryNotFoundError 
} from '../../interfaces';

/**
 * Input for deleting a category
 */
export interface DeleteCategoryInput {
  /** The unique identifier of the category to delete */
  id: string;
  
  /** Whether to force deletion even if category has assigned tasks */
  force?: boolean;
}

/**
 * Use case for deleting a category
 */
@Injectable({
  providedIn: 'root'
})
export class DeleteCategoryUseCase implements UseCase<DeleteCategoryInput, DeleteCategoryOutput> {
  
  constructor(
    private categoryRepository: CategoryRepository,
    private taskRepository: TaskRepository
  ) {}

  /**
   * Executes the category deletion use case
   * 
   * @param input - The category deletion parameters
   * @returns Observable that emits the deletion result
   * @throws CategoryNotFoundError if category doesn't exist
   */
  execute(input: DeleteCategoryInput): Observable<DeleteCategoryOutput> {
    this.validateInput(input);
    
    return this.categoryRepository.findById(input.id).pipe(
      switchMap(category => {
        if (!category) {
          return throwError(() => new CategoryNotFoundError(input.id));
        }

        // Get all tasks assigned to this category
        return this.taskRepository.findByCategory(input.id).pipe(
          switchMap(assignedTasks => {
            const tasksCount = assignedTasks.length;

            // If there are assigned tasks, unassign them first
            if (tasksCount > 0) {
              const unassignOperations = assignedTasks.map(task => {
                task.removeCategory();
                return this.taskRepository.update(task);
              });

              return forkJoin(unassignOperations).pipe(
                switchMap(() => this.deleteCategoryAndReturnResult(category, tasksCount))
              );
            } else {
              return this.deleteCategoryAndReturnResult(category, 0);
            }
          })
        );
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: DeleteCategoryInput): void {
    if (!input) {
      throw new Error('Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new Error('Category ID is required');
    }
  }

  /**
   * Deletes the category and returns the result
   */
  private deleteCategoryAndReturnResult(category: any, affectedTasksCount: number): Observable<DeleteCategoryOutput> {
    return this.categoryRepository.delete(category.id).pipe(
      map(() => ({
        success: true,
        affectedTasksCount,
        deletedCategory: {
          id: category.id,
          name: category.name,
          color: category.color,
          icon: category.icon,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      }))
    );
  }
}