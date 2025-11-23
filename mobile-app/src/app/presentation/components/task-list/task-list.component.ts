/**
 * TaskListComponent - Displays a list of tasks with interactive features
 * 
 * Provides a reactive task list with filtering, completion toggling,
 * and deletion features. Uses Ionic UI components for mobile-first design.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle, 
  ellipseOutline, 
  trash, 
  create, 
  search, 
  add, 
  funnel,
  close,
  addCircle,
  albums,
  listOutline,
  timeOutline,
  trendingUp,
  appsOutline
} from 'ionicons/icons';// Design System imports
import { ButtonComponent, SearchComponent, StatCardComponent, TaskCardComponent, FilterChipComponent } from '@ionic-todo-test/shared-ui';

// Domain imports
import { Task } from '../../../domain';

// Presentation imports
import { TaskStore } from '../../stores/task.store';
import { CategoryStore } from '../../stores/category.store';
import { FeatureFlagStore } from '../../stores/feature-flag.store';

// Infrastructure imports
import { TranslationService } from '../../../infrastructure/services/translation.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ButtonComponent, SearchComponent, StatCardComponent, TaskCardComponent, FilterChipComponent],
  template: `
    <div class="modern-content">
      <!-- Search Bar -->
      <div class="search-section">
        <lib-search 
          [value]="searchTerm()" 
          (searchChange)="onSearchChange($event)"
          [placeholder]="translationService.getTasks('SEARCH_PLACEHOLDER')"
          [debounceTime]="300"
          class="modern-searchbar">
        </lib-search>
      </div>

      <!-- Modern Category Filter Chips -->
      <div class="filter-section" *ngIf="categories().length > 0">
        <!-- All Categories Filter -->
        <lib-filter-chip
          [data]="{
            id: 'all',
            label: translationService.getTasks('ALL_TASKS'),
            icon: 'apps-outline',
            count: taskStats().total
          }"
          [selected]="selectedCategoryId() === null"
          [showCount]="true"
          size="medium"
          variant="filled"
          (chipClick)="onFilterChipClick($event)"
          class="filter-chip-item">
        </lib-filter-chip>

        <!-- Category Filters -->
        <lib-filter-chip
          *ngFor="let category of categories()"
          [data]="{
            id: category.id,
            label: category.name,
            icon: category.icon,
            color: category.color,
            count: getTaskCountForCategory(category.id)
          }"
          [selected]="selectedCategoryId() === category.id"
          [showCount]="true"
          [dismissible]="true"
          size="medium"
          variant="filled"
          (chipClick)="onFilterChipClick($event)"
          (dismissClick)="onFilterChipDismiss($event)"
          class="filter-chip-item">
        </lib-filter-chip>
      </div>

      <!-- Enhanced Statistics Cards -->
      <div class="stats-container" *ngIf="statisticsVisible()">
        <lib-stat-card 
          [value]="taskStats().total.toString()"
          [label]="translationService.getTasks('TOTAL_TASKS')"
          icon="list-outline"
          [variant]="'minimal'"
          [size]="'small'"
          class="stat-card">
        </lib-stat-card>
        
        <lib-stat-card 
          [value]="taskStats().completed.toString()"
          [label]="translationService.getTasks('COMPLETED_TASKS')"
          icon="checkmark-circle"
          [variant]="'minimal'"
          [size]="'small'"
          class="stat-card completed">
        </lib-stat-card>
        
        <lib-stat-card 
          [value]="taskStats().pending.toString()"
          [label]="translationService.getTasks('PENDING_TASKS')"
          icon="time-outline"
          [variant]="'minimal'"
          [size]="'small'"
          class="stat-card pending">
        </lib-stat-card>
        
        <lib-stat-card 
          [value]="taskStats().completionRate + '%'"
          [label]="translationService.getTasks('PROGRESS')"
          icon="trending-up"
          [trend]="taskStats().completionRate > 50 ? 'up' : undefined"
          [variant]="'minimal'"
          [size]="'small'"
          class="stat-card progress">
        </lib-stat-card>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>{{ translationService.getCommon('LOADING') }}...</p>
      </div>

      <!-- Error State -->
      <ion-card *ngIf="error()" color="danger">
        <ion-card-content>
          <h3>{{ translationService.getCommon('ERROR') }}</h3>
          <p>{{ error() }}</p>
          <lib-button 
            variant="clear" 
            startIcon="refresh"
            (buttonClick)="onRetry()">
            {{ translationService.getCommon('RETRY') }}
          </lib-button>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !error() && filteredTasks().length === 0" class="empty-state">
        <ion-icon name="checkbox-outline" size="large"></ion-icon>
        <h3>{{ hasAnyTasks() ? translationService.getTasks('NO_FILTERED_TASKS') : translationService.getTasks('NO_TASKS') }}</h3>
        <p>{{ hasAnyTasks() ? translationService.getTasks('NO_FILTERED_TASKS_DESCRIPTION') : translationService.getTasks('NO_TASKS_DESCRIPTION') }}</p>
        <lib-button 
          variant="primary" 
          startIcon="add"
          (buttonClick)="onAddTask()" 
          *ngIf="!hasAnyTasks()">
          {{ translationService.getTasks('ADD_TASK') }}
        </lib-button>
      </div>

      <!-- Task List with Design System Task Cards -->
      <div *ngIf="filteredTasks().length > 0" class="modern-task-list">
        <lib-task-card 
          *ngFor="let task of filteredTasks(); trackBy: trackByTaskId"
          [task]="task"
          [category]="getCategoryForTask(task.categoryId)"
          [loading]="isLoading()"
          [showActions]="true"
          [showDeleteAction]="deleteTaskEnabled()"
          [showDescription]="true"
          [interactive]="false"
          (toggleComplete)="onToggleCompleteFromCard($event)"
          (editTask)="onEditTaskFromCard($event)"
          (deleteTask)="onDeleteTaskFromCard($event)"
          class="task-card-item">
        </lib-task-card>
      </div>
    </div>
  `,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Inject stores and services
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly featureFlagStore = inject(FeatureFlagStore);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  readonly translationService = inject(TranslationService);

  // Component signals from stores
  readonly tasks = this.taskStore.tasks;
  readonly filteredTasks = this.taskStore.filteredTasks;
  readonly isLoading = this.taskStore.loading;
  readonly error = this.taskStore.error;
  readonly taskStats = this.taskStore.taskStats;
  readonly searchTerm = this.taskStore.searchTerm;
  readonly selectedCategoryId = this.taskStore.selectedCategoryId;
  readonly categories = this.categoryStore.categories;

  // Feature flags from store
  readonly deleteTaskEnabled = this.featureFlagStore.deleteTaskEnabled;
  readonly statisticsVisible = this.featureFlagStore.statisticsVisible;
  readonly maxTasksLimit = this.featureFlagStore.maxTasksLimit;

  // Local computed signals
  readonly hasAnyTasks = computed(() => this.tasks().length > 0);
  readonly canAddMoreTasks = computed(() => this.tasks().length < this.maxTasksLimit());
  
  // FAB menu state
  readonly fabMenuOpen = signal(false);

  constructor() {
    // Add required Ionic icons
    addIcons({
      checkmarkCircle,
      ellipseOutline,
      trash,
      create,
      search,
      add,
      funnel,
      close,
      addCircle,
      albums,
      listOutline,
      timeOutline,
      trendingUp,
      appsOutline
    });
  }

  ngOnInit(): void {
    // Load initial data only if needed
    this.taskStore.loadTasksIfNeeded();
    this.categoryStore.loadCategories();
  }

  /**
   * Handle filter chip click
   */
  onFilterChipClick(chipId: string): void {
    if (chipId === 'all') {
      this.onClearFilters();
    } else {
      this.onCategoryFilter(chipId);
    }
  }

  /**
   * Handle filter chip dismiss
   */
  onFilterChipDismiss(chipId: string): void {
    this.taskStore.setCategoryFilter(null);
  }

  /**
   * Get task count for a specific category
   */
  getTaskCountForCategory(categoryId: string): number {
    return this.tasks().filter(task => task.categoryId === categoryId).length;
  }

  /**
   * Handle search input changes
   */
  onSearchChange(searchTerm: string): void {
    this.taskStore.setSearchTerm(searchTerm);
  }

  /**
   * Handle category filter selection
   */
  onCategoryFilter(categoryId: string): void {
    if (this.selectedCategoryId() === categoryId) {
      // Toggle off if already selected
      this.taskStore.setCategoryFilter(null);
    } else {
      this.taskStore.setCategoryFilter(categoryId);
    }
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.taskStore.clearFilters();
  }

  /**
   * Handle task completion toggle from TaskCardComponent
   */
  onToggleCompleteFromCard(event: { taskId: string; completed: boolean }): void {
    this.taskStore.toggleTaskCompletion(event.taskId).subscribe({
      next: async (updatedTask) => {
        const message = event.completed 
          ? this.translationService.getTasks('COMPLETED_SUCCESS')
          : this.translationService.getTasks('PENDING_SUCCESS');
        const toast = await this.toastController.create({
          message,
          duration: 1500,
          color: event.completed ? 'success' : 'medium'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Failed to toggle task completion:', error);
        const toast = await this.toastController.create({
          message: this.translationService.getTasks('UPDATE_ERROR'),
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  /**
   * Handle edit task from TaskCardComponent
   */
  onEditTaskFromCard(taskId: string): void {
    this.router.navigate(['/task', taskId, 'edit']);
  }

  /**
   * Handle delete task from TaskCardComponent
   */
  async onDeleteTaskFromCard(taskId: string): Promise<void> {
    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return;

    const alert = await this.alertController.create({
      header: this.translationService.getDialogs('DELETE_TASK'),
      message: this.translationService.getDialogs('DELETE_TASK_CONFIRM').replace('{0}', task.title),
      buttons: [
        {
          text: this.translationService.getCommon('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translationService.getCommon('DELETE'),
          role: 'destructive',
          handler: () => {
            this.deleteTaskConfirmed(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Handle task completion toggle with feedback
   */
  onToggleComplete(taskId: string, event: any): void {
    const isCompleted = event.detail.checked;
    this.taskStore.toggleTaskCompletion(taskId).subscribe({
      next: async (updatedTask) => {
        const message = isCompleted 
          ? this.translationService.getTasks('COMPLETED_SUCCESS')
          : this.translationService.getTasks('PENDING_SUCCESS');
        const toast = await this.toastController.create({
          message,
          duration: 1500,
          color: isCompleted ? 'success' : 'medium'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Failed to toggle task completion:', error);
        // Revert the checkbox state
        event.target.checked = !isCompleted;
        const toast = await this.toastController.create({
          message: this.translationService.getTasks('UPDATE_ERROR'),
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  /**
   * Handle task deletion with confirmation
   */
  async onDeleteTask(taskId: string): Promise<void> {
    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return;

    const alert = await this.alertController.create({
      header: this.translationService.getDialogs('DELETE_TASK'),
      message: this.translationService.getDialogs('DELETE_TASK_CONFIRM').replace('{0}', task.title),
      buttons: [
        {
          text: this.translationService.getCommon('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translationService.getCommon('DELETE'),
          role: 'destructive',
          handler: () => {
            this.deleteTaskConfirmed(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  private deleteTaskConfirmed(taskId: string): void {
    this.taskStore.deleteTask(taskId).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: this.translationService.getTasks('DELETED_SUCCESS'),
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Failed to delete task:', error);
        const toast = await this.toastController.create({
          message: this.translationService.getTasks('DELETE_ERROR'),
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  /**
   * Handle add task action - navigate to task form
   */
  async onAddTask(): Promise<void> {
    this.fabMenuOpen.set(false); // Close FAB menu
    
    // Check if we can add more tasks
    if (!this.canAddMoreTasks()) {
      const alert = await this.alertController.create({
        header: this.translationService.getTasks('TASK_LIMIT_REACHED'),
        message: this.translationService.getTasks('TASK_LIMIT_MESSAGE', [this.maxTasksLimit()]),
        buttons: [this.translationService.getCommon('OK')]
      });
      await alert.present();
      return;
    }
    
    this.router.navigate(['/task/new']);
  }

  /**
   * Handle edit task action - navigate to edit form
   */
  onEditTask(task: Task): void {
    this.router.navigate(['/task', task.id, 'edit']);
  }

  /**
   * Handle retry action
   */
  onRetry(): void {
    this.taskStore.refresh();
    this.categoryStore.refresh();
  }

  /**
   * Track by function for ngFor performance
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /**
   * Get category for a task
   */
  getCategoryForTask(categoryId: string | null) {
    if (!categoryId) return null;
    return this.categoryStore.getCategoryById(categoryId);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  /**
   * Toggle FAB menu state
   */
  toggleFabMenu(): void {
    this.fabMenuOpen.set(!this.fabMenuOpen());
  }

  /**
   * Navigate to categories page
   */
  navigateToCategories(): void {
    this.fabMenuOpen.set(false); // Close FAB menu
    this.router.navigate(['/categories']);
  }
}