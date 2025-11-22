/**
 * TaskRepositoryImpl - Concrete implementation of TaskRepository
 * 
 * Implements the TaskRepository interface from the domain layer using
 * the storage service for data persistence. This follows the Repository pattern
 * and Hexagonal Architecture principles.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Domain imports
import { Task, TaskRepository } from '../../../domain';

// Infrastructure imports
import { StorageService } from '../storage/storage.service';
import { TaskMapper } from '../../mappers/task.mapper';
import { TaskDTO, STORAGE_KEYS } from '../storage/storage.types';

/**
 * Task repository implementation using storage service
 */
@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryImpl implements TaskRepository {
  
  constructor(
    private storageService: StorageService,
    private taskMapper: TaskMapper
  ) {}

  /**
   * Find all tasks
   * 
   * @returns Observable with array of all tasks
   */
  findAll(): Observable<Task[]> {
    return this.storageService.get<TaskDTO[]>(STORAGE_KEYS.TASKS).pipe(
      map(dtos => dtos || []),
      map(dtos => this.taskMapper.safeToDomainArray(dtos)),
      catchError(error => {
        console.error('Error finding all tasks:', error);
        return of([]);
      })
    );
  }

  /**
   * Find task by ID
   * 
   * @param id - Task ID to find
   * @returns Observable with task or null if not found
   */
  findById(id: string): Observable<Task | null> {
    return this.findAll().pipe(
      map(tasks => tasks.find(task => task.id === id) || null)
    );
  }

  /**
   * Find tasks by category ID
   * 
   * @param categoryId - Category ID to filter by
   * @returns Observable with array of tasks in the category
   */
  findByCategory(categoryId: string): Observable<Task[]> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => task.categoryId === categoryId))
    );
  }

  /**
   * Save a new task
   * 
   * @param task - Task to save
   * @returns Observable with saved task
   */
  save(task: Task): Observable<Task> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        // Check if task already exists
        const existingIndex = existingTasks.findIndex(t => t.id === task.id);
        if (existingIndex >= 0) {
          return throwError(() => new Error(`Task with ID ${task.id} already exists. Use update() instead.`));
        }

        // Add new task
        const updatedTasks = [...existingTasks, task];
        const taskDTOs = this.taskMapper.toDTOArray(updatedTasks);
        
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs).pipe(
          map(() => task)
        );
      }),
      catchError(error => {
        console.error('Error saving task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing task
   * 
   * @param task - Task to update
   * @returns Observable with updated task
   */
  update(task: Task): Observable<Task> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        const existingIndex = existingTasks.findIndex(t => t.id === task.id);
        if (existingIndex === -1) {
          return throwError(() => new Error(`Task with ID ${task.id} not found`));
        }

        // Replace the existing task
        const updatedTasks = [...existingTasks];
        updatedTasks[existingIndex] = task;
        const taskDTOs = this.taskMapper.toDTOArray(updatedTasks);
        
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs).pipe(
          map(() => task)
        );
      }),
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a task by ID
   * 
   * @param id - ID of task to delete
   * @returns Observable that completes when deleted
   */
  delete(id: string): Observable<void> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        const filteredTasks = existingTasks.filter(task => task.id !== id);
        
        // Check if task existed
        if (filteredTasks.length === existingTasks.length) {
          return throwError(() => new Error(`Task with ID ${id} not found`));
        }

        const taskDTOs = this.taskMapper.toDTOArray(filteredTasks);
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs);
      }),
      catchError(error => {
        console.error('Error deleting task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Count total tasks
   * 
   * @returns Observable with total count
   */
  count(): Observable<number> {
    return this.findAll().pipe(
      map(tasks => tasks.length)
    );
  }

  /**
   * Count tasks by category
   * 
   * @param categoryId - Category ID to count
   * @returns Observable with count
   */
  countByCategory(categoryId: string): Observable<number> {
    return this.findByCategory(categoryId).pipe(
      map(tasks => tasks.length)
    );
  }

  /**
   * Count completed tasks
   * 
   * @returns Observable with completed count
   */
  countCompleted(): Observable<number> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => task.completed).length)
    );
  }

  /**
   * Count pending (not completed) tasks
   * 
   * @returns Observable with pending count
   */
  countPending(): Observable<number> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => !task.completed).length)
    );
  }

  /**
   * Find completed tasks
   * 
   * @returns Observable with array of completed tasks
   */
  findCompleted(): Observable<Task[]> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => task.completed))
    );
  }

  /**
   * Find pending (not completed) tasks
   * 
   * @returns Observable with array of pending tasks
   */
  findPending(): Observable<Task[]> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => !task.completed))
    );
  }

  /**
   * Find uncategorized tasks (no category assigned)
   * 
   * @returns Observable with array of uncategorized tasks
   */
  findUncategorized(): Observable<Task[]> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => task.categoryId === null || task.categoryId === undefined))
    );
  }

  /**
   * Search tasks by text in title or description
   * 
   * @param searchTerm - Text to search for
   * @returns Observable with array of matching tasks
   */
  searchByText(searchTerm: string): Observable<Task[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return this.findAll();
    }

    const term = searchTerm.toLowerCase().trim();
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => 
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      ))
    );
  }

  /**
   * Check if a task exists by ID
   * 
   * @param id - Task ID to check
   * @returns Observable with true if exists, false otherwise
   */
  exists(id: string): Observable<boolean> {
    return this.findById(id).pipe(
      map(task => task !== null)
    );
  }

  /**
   * Find tasks within a date range
   * 
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Observable with array of tasks
   */
  findByDateRange(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => {
        const taskDate = task.createdAt;
        return taskDate >= startDate && taskDate <= endDate;
      }))
    );
  }

  /**
   * Search tasks by title or description
   * 
   * @param query - Search query
   * @returns Observable with array of matching tasks
   */
  search(query: string): Observable<Task[]> {
    if (!query || query.trim().length === 0) {
      return this.findAll();
    }

    const searchTerm = query.toLowerCase().trim();
    
    return this.findAll().pipe(
      map(tasks => tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      ))
    );
  }

  /**
   * Delete all tasks for a category (when category is deleted)
   * 
   * @param categoryId - Category ID
   * @returns Observable that completes when done
   */
  deleteByCategory(categoryId: string): Observable<void> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        const filteredTasks = existingTasks.filter(task => task.categoryId !== categoryId);
        const taskDTOs = this.taskMapper.toDTOArray(filteredTasks);
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs);
      }),
      catchError(error => {
        console.error('Error deleting tasks by category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Mark all tasks as completed
   * 
   * @returns Observable with updated tasks
   */
  markAllCompleted(): Observable<Task[]> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        const updatedTasks = existingTasks.map(task => {
          if (!task.completed) {
            task.complete();
          }
          return task;
        });

        const taskDTOs = this.taskMapper.toDTOArray(updatedTasks);
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs).pipe(
          map(() => updatedTasks)
        );
      }),
      catchError(error => {
        console.error('Error marking all tasks as completed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Unassign category from tasks (set categoryId to null)
   * Used when a category is deleted
   * 
   * @param categoryId - Category ID to unassign
   * @returns Observable with updated tasks
   */
  unassignCategory(categoryId: string): Observable<Task[]> {
    return this.findAll().pipe(
      switchMap(existingTasks => {
        const updatedTasks = existingTasks.map(task => {
          if (task.categoryId === categoryId) {
            task.removeCategory();
          }
          return task;
        });

        const taskDTOs = this.taskMapper.toDTOArray(updatedTasks);
        return this.storageService.set(STORAGE_KEYS.TASKS, taskDTOs).pipe(
          map(() => updatedTasks)
        );
      }),
      catchError(error => {
        console.error('Error unassigning category from tasks:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Initialize storage with empty tasks array if not exists
   * 
   * @returns Observable that completes when initialized
   */
  initialize(): Observable<void> {
    return this.storageService.has(STORAGE_KEYS.TASKS).pipe(
      switchMap(exists => {
        if (!exists) {
          return this.storageService.set(STORAGE_KEYS.TASKS, []);
        }
        return of(void 0);
      }),
      catchError(error => {
        console.error('Error initializing task storage:', error);
        return throwError(() => error);
      })
    );
  }
}