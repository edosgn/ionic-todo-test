/**
 * CategoryStore - Reactive state management for categories using Angular Signals
 * 
 * Provides centralized state management for category operations with reactive updates.
 * Uses Angular Signals for efficient change detection and computed values.
 * Integrates with application layer use cases following hexagonal architecture.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable, signal, computed } from '@angular/core';
import { Observable, map, tap, shareReplay } from 'rxjs';

// Domain imports
import { Category } from '../../domain';

// Application imports
import {
  GetAllCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryStatsUseCase,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryOutput,
  CategoryStatsOutput
} from '../../application';

// Presentation imports
import { CategoryPresentationMapper } from '../mappers/category-presentation.mapper';

/**
 * Category Store Service
 * 
 * Manages category state with Angular Signals for reactive UI updates.
 * Provides computed signals for derived state like sorted categories and statistics.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryStore {
  
  // Private signals for internal state
  private readonly _categories = signal<Category[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _stats = signal<CategoryStatsOutput | null>(null);

  // Public readonly signals
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly stats = this._stats.asReadonly();

  // Computed signals for derived state
  readonly sortedCategories = computed(() => 
    [...this._categories()].sort((a, b) => a.name.localeCompare(b.name))
  );

  readonly categoriesByCreationDate = computed(() => 
    [...this._categories()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );

  readonly categoryCount = computed(() => this._categories().length);

  readonly hasCategories = computed(() => this._categories().length > 0);

  constructor(
    private getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
    private getCategoryStatsUseCase: GetCategoryStatsUseCase,
    private mapper: CategoryPresentationMapper
  ) {}

  /**
   * Load all categories from repository
   */
  loadCategories(): void {
    this._loading.set(true);
    this._error.set(null);

    this.getAllCategoriesUseCase.execute().subscribe({
      next: (categoryOutputs) => {
        const categories = this.mapper.toDomainArray(categoryOutputs);
        this._categories.set(categories);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this._error.set(error.message || 'Error al cargar las categorías');
        this._loading.set(false);
      }
    });
  }

  /**
   * Create a new category
   */
  createCategory(input: CreateCategoryInput): Observable<Category> {
    this._loading.set(true);
    this._error.set(null);

    // Create a shared observable to prevent multiple subscriptions
    const result$ = this.createCategoryUseCase.execute(input).pipe(
      tap({
        next: (categoryOutput: CategoryOutput) => {
          // Convert DTO to domain entity and add to current state
          const category = this.mapper.toDomain(categoryOutput);
          this._categories.update(categories => [...categories, category]);
          this._loading.set(false);
        },
        error: (error: any) => {
          console.error('Error creating category:', error);
          this._error.set(error.message || 'Error al crear la categoría');
          this._loading.set(false);
        }
      }),
      map((categoryOutput: CategoryOutput) => this.mapper.toDomain(categoryOutput)),
      shareReplay(1) // Prevent multiple executions
    );

    return result$;
  }

  /**
   * Update an existing category
   */
  updateCategory(input: UpdateCategoryInput): Observable<Category> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.updateCategoryUseCase.execute(input);
    
    result$.subscribe({
      next: (categoryOutput) => {
        // Convert DTO to domain entity and update in current state
        const updatedCategory = this.mapper.toDomain(categoryOutput);
        this._categories.update(categories => 
          categories.map(category => 
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this._error.set(error.message || 'Error al actualizar la categoría');
        this._loading.set(false);
      }
    });

    // Return mapped observable for caller
    return result$.pipe(
      map((categoryOutput: CategoryOutput) => this.mapper.toDomain(categoryOutput))
    );
  }

  /**
   * Delete a category
   */
  deleteCategory(categoryId: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.deleteCategoryUseCase.execute({ id: categoryId });
    
    result$.subscribe({
      next: (deleteResult) => {
        // Remove category from current state
        this._categories.update(categories => 
          categories.filter(category => category.id !== categoryId)
        );
        this._loading.set(false);
        
        // Log successful deletion with affected tasks count
        console.log(`Category deleted successfully. ${deleteResult.affectedTasksCount} tasks were unassigned.`);
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this._error.set(error.message || 'Error al eliminar la categoría');
        this._loading.set(false);
      }
    });

    // Return void observable for consistency
    return result$.pipe(
      map(() => void 0)
    );
  }

  /**
   * Load category statistics
   */
  loadCategoryStats(): void {
    this._loading.set(true);
    this._error.set(null);

    this.getCategoryStatsUseCase.execute().subscribe({
      next: (stats) => {
        this._stats.set(stats);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading category stats:', error);
        this._error.set(error.message || 'Error al cargar las estadísticas de categorías');
        this._loading.set(false);
      }
    });
  }

  /**
   * Get category by ID from current state
   */
  getCategoryById(categoryId: string): Category | null {
    return this._categories().find(category => category.id === categoryId) || null;
  }

  /**
   * Get category by name from current state
   */
  getCategoryByName(name: string): Category | null {
    return this._categories().find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    ) || null;
  }

  /**
   * Check if a category name already exists
   */
  categoryNameExists(name: string, excludeId?: string): boolean {
    return this._categories().some(category => 
      category.name.toLowerCase() === name.toLowerCase() &&
      (!excludeId || category.id !== excludeId)
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Refresh categories (reload from repository)
   */
  refresh(): void {
    this.loadCategories();
  }
}