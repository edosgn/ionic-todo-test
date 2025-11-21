/**
 * GetCategoryStatsUseCase - Retrieves category statistics
 * 
 * This use case provides statistics about categories including task counts
 * and completion rates. Useful for analytics and dashboard views.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';

// Domain imports
import { CategoryRepository, TaskRepository } from '../../../domain';

// Application imports
import { 
  CategoryStatsOutput, 
  NoInputUseCase 
} from '../../interfaces';

/**
 * Use case for retrieving category statistics
 */
@Injectable({
  providedIn: 'root'
})
export class GetCategoryStatsUseCase implements NoInputUseCase<CategoryStatsOutput> {
  
  constructor(
    private categoryRepository: CategoryRepository,
    private taskRepository: TaskRepository
  ) {}

  /**
   * Executes the category statistics use case
   * 
   * @returns Observable that emits category statistics
   */
  execute(): Observable<CategoryStatsOutput> {
    return forkJoin({
      categories: this.categoryRepository.findAll(),
      tasks: this.taskRepository.findAll()
    }).pipe(
      map(({ categories, tasks }) => {
        // Calculate stats for each category
        const categoriesWithTaskCounts = categories.map(category => {
          const categoryTasks = tasks.filter(task => task.categoryId === category.id);
          const completedTasks = categoryTasks.filter(task => task.completed).length;
          const pendingTasks = categoryTasks.length - completedTasks;

          return {
            category: {
              id: category.id,
              name: category.name,
              color: category.color,
              icon: category.icon,
              createdAt: category.createdAt,
              updatedAt: category.updatedAt
            },
            totalTasks: categoryTasks.length,
            completedTasks,
            pendingTasks
          };
        });

        // Count unassigned tasks
        const unassignedTasks = tasks.filter(task => task.categoryId === null).length;

        return {
          totalCategories: categories.length,
          categoriesWithTaskCounts,
          unassignedTasks
        };
      })
    );
  }
}