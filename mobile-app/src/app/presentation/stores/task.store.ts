/**
 * TaskStore - Reactive state management for tasks using Angular Signals
 * 
 * Provides centralized state management for task operations with reactive updates.
 * Uses Angular Signals for efficient change detection and computed values.
 * Integrates with application layer use cases following hexagonal architecture.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

// Domain imports
import { Task } from '../../domain';

// Application imports
import {
  GetAllTasksUseCase,
  GetTaskByIdUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CompleteTaskUseCase,
  GetTasksByCategoryUseCase,
  CreateTaskInput,
  UpdateTaskInput,
  CompleteTaskInput,
  TaskOutput
} from '../../application';

// Presentation imports
import { TaskPresentationMapper } from '../mappers/task-presentation.mapper';
import { FeatureFlagStore } from './feature-flag.store';

/**
 * Task Store Service
 * 
 * Manages task state with Angular Signals for reactive UI updates.
 * Provides computed signals for derived state like filtered tasks and statistics.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  
  // Private signals for internal state
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedCategoryId = signal<string | null>(null);
  private readonly _searchTerm = signal<string>('');

  // Public readonly signals
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

  // Computed signals for derived state
  readonly completedTasks = computed(() => 
    this._tasks().filter(task => task.completed)
  );

  readonly pendingTasks = computed(() => 
    this._tasks().filter(task => !task.completed)
  );

  readonly uncategorizedTasks = computed(() => 
    this._tasks().filter(task => task.categoryId === null)
  );

  readonly filteredTasks = computed(() => {
    let filtered = this._tasks();
    
    // Filter by category
    const categoryId = this._selectedCategoryId();
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }
    
    // Filter by search term
    const term = this._searchTerm().toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  });

  readonly taskStats = computed(() => {
    const allTasks = this._tasks();
    const completed = allTasks.filter(task => task.completed).length;
    const pending = allTasks.length - completed;
    
    return {
      total: allTasks.length,
      completed,
      pending,
      completionRate: allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0
    };
  });

  constructor(
    private getAllTasksUseCase: GetAllTasksUseCase,
    private getTaskByIdUseCase: GetTaskByIdUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private completeTaskUseCase: CompleteTaskUseCase,
    private getTasksByCategoryUseCase: GetTasksByCategoryUseCase,
    private mapper: TaskPresentationMapper
  ) {
    // Inject FeatureFlagStore
    this.featureFlagStore = inject(FeatureFlagStore);
  }

  private readonly featureFlagStore: FeatureFlagStore;

  /**
   * Load all tasks from repository
   */
  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.getAllTasksUseCase.execute().subscribe({
      next: (taskOutputs) => {
        const tasks = this.mapper.toDomainArray(taskOutputs);
        this._tasks.set(tasks);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this._error.set(error.message || 'Error al cargar las tareas');
        this._loading.set(false);
      }
    });
  }

  /**
   * Create a new task
   */
  createTask(input: CreateTaskInput): Observable<Task> {
    // Validate max tasks limit from feature flags
    const maxTasks = this.featureFlagStore.maxTasksLimit();
    const currentTaskCount = this._tasks().length;
    
    if (currentTaskCount >= maxTasks) {
      const errorMsg = `No se puede crear la tarea. Se ha alcanzado el límite máximo de ${maxTasks} tareas.`;
      this._error.set(errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    this._loading.set(true);
    this._error.set(null);

    const result$ = this.createTaskUseCase.execute(input);
    
    result$.subscribe({
      next: (taskOutput) => {
        // Convert DTO to domain entity and add to current state
        const task = this.mapper.toDomain(taskOutput);
        this._tasks.update(tasks => [...tasks, task]);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this._error.set(error.message || 'Failed to create task');
        this._loading.set(false);
      }
    });

    // Return mapped observable for caller
    return result$.pipe(
      map(taskOutput => this.mapper.toDomain(taskOutput))
    );
  }

  /**
   * Update an existing task
   */
  updateTask(input: UpdateTaskInput): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.updateTaskUseCase.execute(input);
    
    result$.subscribe({
      next: (taskOutput) => {
        // Convert DTO to domain entity and update in current state
        const updatedTask = this.mapper.toDomain(taskOutput);
        this._tasks.update(tasks => 
          tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this._error.set(error.message || 'Failed to update task');
        this._loading.set(false);
      }
    });

    // Return mapped observable for caller
    return result$.pipe(
      map((taskOutput: TaskOutput) => this.mapper.toDomain(taskOutput))
    );
  }

  /**
   * Delete a task
   */
  deleteTask(taskId: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.deleteTaskUseCase.execute({ id: taskId });
    
    result$.subscribe({
      next: () => {
        // Remove task from current state
        this._tasks.update(tasks => 
          tasks.filter(task => task.id !== taskId)
        );
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this._error.set(error.message || 'Failed to delete task');
        this._loading.set(false);
      }
    });

    return result$;
  }

  /**
   * Toggle task completion status
   */
  toggleTaskCompletion(taskId: string): Observable<Task> {
    // First, find the current task to get its completion status
    const currentTask = this._tasks().find(task => task.id === taskId);
    if (!currentTask) {
      throw new Error(`Task with ID ${taskId} not found in current state`);
    }

    this._loading.set(true);
    this._error.set(null);

    const result$ = this.completeTaskUseCase.execute({ 
      id: taskId, 
      completed: !currentTask.completed 
    });
    
    result$.subscribe({
      next: (taskOutput) => {
        // Convert DTO to domain entity and update in current state
        const updatedTask = this.mapper.toDomain(taskOutput);
        this._tasks.update(tasks => 
          tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error toggling task completion:', error);
        this._error.set(error.message || 'Failed to update task');
        this._loading.set(false);
      }
    });

    // Return mapped observable for caller
    return result$.pipe(
      map((taskOutput: TaskOutput) => this.mapper.toDomain(taskOutput))
    );
  }

  /**
   * Load tasks for a specific category
   */
  loadTasksByCategory(categoryId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.getTasksByCategoryUseCase.execute({ categoryId }).subscribe({
      next: (taskOutputs) => {
        const tasks = this.mapper.toDomainArray(taskOutputs);
        this._tasks.set(tasks);
        this._selectedCategoryId.set(categoryId);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks by category:', error);
        this._error.set(error.message || 'Failed to load tasks');
        this._loading.set(false);
      }
    });
  }

  /**
   * Set search filter
   */
  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  /**
   * Set category filter
   */
  setCategoryFilter(categoryId: string | null): void {
    this._selectedCategoryId.set(categoryId);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this._selectedCategoryId.set(null);
    this._searchTerm.set('');
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Get task by ID
   */
  getTaskById(taskId: string): Observable<Task | null> {
    return this.getTaskByIdUseCase.execute({ id: taskId }).pipe(
      map((taskOutput: TaskOutput) => this.mapper.toDomain(taskOutput))
    );
  }

  /**
   * Refresh tasks (reload from repository)
   */
  refresh(): void {
    this.loadTasks();
  }
}