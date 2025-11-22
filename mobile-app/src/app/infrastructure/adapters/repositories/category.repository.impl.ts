/**
 * CategoryRepositoryImpl - Concrete implementation of CategoryRepository
 * 
 * Implements the CategoryRepository interface from the domain layer using
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
import { Category, CategoryRepository } from '../../../domain';

// Infrastructure imports
import { StorageService } from '../storage/storage.service';
import { CategoryMapper } from '../../mappers/category.mapper';
import { CategoryDTO, TaskDTO, STORAGE_KEYS } from '../storage/storage.types';

/**
 * Category repository implementation using storage service
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryImpl implements CategoryRepository {
  
  constructor(
    private storageService: StorageService,
    private categoryMapper: CategoryMapper
  ) {}

  /**
   * Find all categories
   * 
   * @returns Observable with array of all categories
   */
  findAll(): Observable<Category[]> {
    return this.storageService.get<CategoryDTO[]>(STORAGE_KEYS.CATEGORIES).pipe(
      map(dtos => dtos || []),
      map(dtos => this.categoryMapper.safeToDomainArray(dtos)),
      catchError(error => {
        console.error('Error finding all categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Find category by ID
   * 
   * @param id - Category ID to find
   * @returns Observable with category or null if not found
   */
  findById(id: string): Observable<Category | null> {
    return this.findAll().pipe(
      map(categories => categories.find(category => category.id === id) || null)
    );
  }

  /**
   * Find category by name
   * 
   * @param name - Category name to find
   * @returns Observable with category or null if not found
   */
  findByName(name: string): Observable<Category | null> {
    return this.findAll().pipe(
      map(categories => categories.find(category => category.name.toLowerCase() === name.toLowerCase()) || null)
    );
  }

  /**
   * Search categories by name containing text
   * 
   * @param searchTerm - Text to search for in category names
   * @returns Observable with array of matching categories
   */
  searchByName(searchTerm: string): Observable<Category[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return this.findAll();
    }

    const term = searchTerm.toLowerCase().trim();
    return this.findAll().pipe(
      map(categories => categories.filter(category => 
        category.name.toLowerCase().includes(term)
      ))
    );
  }

  /**
   * Find all categories sorted by name
   * 
   * @param ascending - Sort order (default: true)
   * @returns Observable with sorted categories
   */
  findAllSorted(ascending: boolean = true): Observable<Category[]> {
    return this.findAll().pipe(
      map(categories => {
        const sorted = [...categories].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        return ascending ? sorted : sorted.reverse();
      })
    );
  }

  /**
   * Find all categories sorted by creation date
   * 
   * @param ascending - Sort order (default: false for newest first)
   * @returns Observable with categories sorted by date
   */
  findAllByCreationDate(ascending: boolean = false): Observable<Category[]> {
    return this.findAll().pipe(
      map(categories => {
        const sorted = [...categories].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        return ascending ? sorted : sorted.reverse();
      })
    );
  }

  /**
   * Save a new category
   * 
   * @param category - Category to save
   * @returns Observable with saved category
   */
  save(category: Category): Observable<Category> {
    return this.findAll().pipe(
      switchMap(existingCategories => {
        // Check if category already exists
        const existingIndex = existingCategories.findIndex(c => c.id === category.id);
        if (existingIndex >= 0) {
          return throwError(() => new Error(`Category with ID ${category.id} already exists. Use update() instead.`));
        }

        // Check if name already exists
        const nameExists = existingCategories.some(c => c.name.toLowerCase() === category.name.toLowerCase());
        if (nameExists) {
          return throwError(() => new Error(`Category with name "${category.name}" already exists.`));
        }

        // Add new category
        const updatedCategories = [...existingCategories, category];
        const categoryDTOs = this.categoryMapper.toDTOArray(updatedCategories);
        
        return this.storageService.set(STORAGE_KEYS.CATEGORIES, categoryDTOs).pipe(
          map(() => category)
        );
      }),
      catchError(error => {
        console.error('Error saving category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing category
   * 
   * @param category - Category to update
   * @returns Observable with updated category
   */
  update(category: Category): Observable<Category> {
    return this.findAll().pipe(
      switchMap(existingCategories => {
        const existingIndex = existingCategories.findIndex(c => c.id === category.id);
        if (existingIndex === -1) {
          return throwError(() => new Error(`Category with ID ${category.id} not found`));
        }

        // Check if new name conflicts with other categories
        const nameConflict = existingCategories.some(c => 
          c.id !== category.id && 
          c.name.toLowerCase() === category.name.toLowerCase()
        );
        if (nameConflict) {
          return throwError(() => new Error(`Category with name "${category.name}" already exists.`));
        }

        // Replace the existing category
        const updatedCategories = [...existingCategories];
        updatedCategories[existingIndex] = category;
        const categoryDTOs = this.categoryMapper.toDTOArray(updatedCategories);
        
        return this.storageService.set(STORAGE_KEYS.CATEGORIES, categoryDTOs).pipe(
          map(() => category)
        );
      }),
      catchError(error => {
        console.error('Error updating category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a category by ID
   * 
   * @param id - ID of category to delete
   * @returns Observable that completes when deleted
   */
  delete(id: string): Observable<void> {
    return this.findAll().pipe(
      switchMap(existingCategories => {
        const filteredCategories = existingCategories.filter(category => category.id !== id);
        
        // Check if category existed
        if (filteredCategories.length === existingCategories.length) {
          return throwError(() => new Error(`Category with ID ${id} not found`));
        }

        const categoryDTOs = this.categoryMapper.toDTOArray(filteredCategories);
        return this.storageService.set(STORAGE_KEYS.CATEGORIES, categoryDTOs);
      }),
      catchError(error => {
        console.error('Error deleting category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Count total categories
   * 
   * @returns Observable with total count
   */
  count(): Observable<number> {
    return this.findAll().pipe(
      map(categories => categories.length)
    );
  }

  /**
   * Check if a category exists by ID
   * 
   * @param id - Category ID to check
   * @returns Observable with true if exists, false otherwise
   */
  exists(id: string): Observable<boolean> {
    return this.findById(id).pipe(
      map(category => category !== null)
    );
  }

  /**
   * Check if a category exists by name
   * 
   * @param name - Category name to check
   * @returns Observable with true if exists, false otherwise
   */
  existsByName(name: string): Observable<boolean> {
    return this.findByName(name).pipe(
      map(category => category !== null)
    );
  }

  /**
   * Check if a category exists by name excluding a specific ID
   * 
   * @param name - Category name to check
   * @param excludeId - Category ID to exclude from search
   * @returns Observable with true if another category exists with the name
   */
  existsByNameExcluding(name: string, excludeId: string): Observable<boolean> {
    return this.findAll().pipe(
      map(categories => categories.some(c => 
        c.id !== excludeId && 
        c.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  /**
   * Find most used categories (by task count)
   * 
   * @param limit - Maximum number of categories to return (default: 5)
   * @returns Observable with array of most used categories
   */
  findMostUsed(limit: number = 5): Observable<Category[]> {
    return forkJoin({
      categories: this.findAll(),
      tasks: this.storageService.get<TaskDTO[]>(STORAGE_KEYS.TASKS).pipe(
        map(tasks => tasks || [])
      )
    }).pipe(
      map(({ categories, tasks }) => {
        // Count tasks per category
        const categoryUsage = categories.map(category => ({
          category,
          taskCount: tasks.filter(task => task.categoryId === category.id).length
        }));

        // Sort by task count and return top categories
        return categoryUsage
          .filter(item => item.taskCount > 0) // Only categories with tasks
          .sort((a, b) => b.taskCount - a.taskCount)
          .slice(0, limit)
          .map(item => item.category);
      }),
      catchError(error => {
        console.error('Error finding most used categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Find unused categories (with no tasks assigned)
   * 
   * @returns Observable with array of unused categories
   */
  findUnused(): Observable<Category[]> {
    return forkJoin({
      categories: this.findAll(),
      tasks: this.storageService.get<TaskDTO[]>(STORAGE_KEYS.TASKS).pipe(
        map(tasks => tasks || [])
      )
    }).pipe(
      map(({ categories, tasks }) => {
        // Filter categories with no tasks
        return categories.filter(category => 
          !tasks.some(task => task.categoryId === category.id)
        );
      }),
      catchError(error => {
        console.error('Error finding unused categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Initialize storage with empty categories array if not exists
   * 
   * @returns Observable that completes when initialized
   */
  initialize(): Observable<void> {
    return this.storageService.has(STORAGE_KEYS.CATEGORIES).pipe(
      switchMap(exists => {
        if (!exists) {
          return this.storageService.set(STORAGE_KEYS.CATEGORIES, []);
        }
        return of(void 0);
      }),
      catchError(error => {
        console.error('Error initializing category storage:', error);
        return throwError(() => error);
      })
    );
  }
}