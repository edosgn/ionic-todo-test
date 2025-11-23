import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, map, throwError, tap } from 'rxjs';

import { Task } from '../../domain';
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
import { TaskPresentationMapper } from '../mappers/task-presentation.mapper';
import { FeatureFlagStore } from './feature-flag.store';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedCategoryId = signal<string | null>(null);
  private readonly _searchTerm = signal<string>('');
  private readonly _isInitialized = signal<boolean>(false);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

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
    
    const categoryId = this._selectedCategoryId();
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }
    
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

  getTaskCountByCategory = computed(() => {
    return (categoryId: string): number => {
      return this._tasks().filter(task => task.categoryId === categoryId).length;
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
    this.featureFlagStore = inject(FeatureFlagStore);
  }

  private readonly featureFlagStore: FeatureFlagStore;

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.getAllTasksUseCase.execute().subscribe({
      next: (taskOutputs) => {
        const tasks = this.mapper.toDomainArray(taskOutputs);
        this._tasks.set(tasks);
        this._loading.set(false);
        this._isInitialized.set(true);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this._error.set(error.message || 'Error al cargar las tareas');
        this._loading.set(false);
      }
    });
  }

  loadTasksIfNeeded(): void {
    if (!this._isInitialized()) {
      this.loadTasks();
    }
  }

  createTask(input: CreateTaskInput): Observable<Task> {
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
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this._error.set(error.message || 'Failed to create task');
        this._loading.set(false);
      }
    });

    return result$.pipe(
      map(taskOutput => this.mapper.toDomain(taskOutput))
    );
  }

  updateTask(input: UpdateTaskInput): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.updateTaskUseCase.execute(input);
    
    result$.subscribe({
      next: (taskOutput) => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this._error.set(error.message || 'Failed to update task');
        this._loading.set(false);
      }
    });

    return result$.pipe(
      map((taskOutput: TaskOutput) => this.mapper.toDomain(taskOutput))
    );
  }

  deleteTask(taskId: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    const result$ = this.deleteTaskUseCase.execute({ id: taskId });
    
    return result$.pipe(
      tap({
        next: () => {
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
      })
    );
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

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setCategoryFilter(categoryId: string | null): void {
    this._selectedCategoryId.set(categoryId);
  }

  clearFilters(): void {
    this._selectedCategoryId.set(null);
    this._searchTerm.set('');
  }

  clearError(): void {
    this._error.set(null);
  }

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