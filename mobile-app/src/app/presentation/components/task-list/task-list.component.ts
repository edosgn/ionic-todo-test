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
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle, 
  ellipseOutline, 
  trash, 
  create, 
  search,
  add,
  funnel
} from 'ionicons/icons';

// Domain imports
import { Task } from '../../../domain';

// Presentation imports
import { TaskStore } from '../../stores/task.store';
import { CategoryStore } from '../../stores/category.store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onAddTask()">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <!-- Search Bar -->
      <ion-searchbar 
        [value]="searchTerm()" 
        (ionInput)="onSearchChange($event)"
        placeholder="Search tasks..."
        [debounce]="300">
      </ion-searchbar>

      <!-- Category Filter -->
      <div class="filter-section" *ngIf="categories().length > 0">
        <ion-chip 
          *ngFor="let category of categories()" 
          [color]="selectedCategoryId() === category.id ? 'primary' : 'medium'"
          (click)="onCategoryFilter(category.id)">
          <ion-icon [name]="category.icon"></ion-icon>
          <ion-label>{{ category.name }}</ion-label>
        </ion-chip>
        <ion-chip 
          [color]="selectedCategoryId() === null ? 'primary' : 'medium'"
          (click)="onClearFilters()">
          <ion-icon name="funnel"></ion-icon>
          <ion-label>All</ion-label>
        </ion-chip>
      </div>

      <!-- Task Statistics -->
      <ion-card class="stats-card">
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <h3>{{ taskStats().total }}</h3>
              <p>Total</p>
            </div>
            <div class="stat-item">
              <h3>{{ taskStats().completed }}</h3>
              <p>Completed</p>
            </div>
            <div class="stat-item">
              <h3>{{ taskStats().pending }}</h3>
              <p>Pending</p>
            </div>
            <div class="stat-item">
              <h3>{{ taskStats().completionRate }}%</h3>
              <p>Progress</p>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Loading tasks...</p>
      </div>

      <!-- Error State -->
      <ion-card *ngIf="error()" color="danger">
        <ion-card-content>
          <h3>Error</h3>
          <p>{{ error() }}</p>
          <ion-button fill="clear" (click)="onRetry()">
            <ion-icon name="refresh" slot="start"></ion-icon>
            Retry
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !error() && filteredTasks().length === 0" class="empty-state">
        <ion-icon name="checkbox-outline" size="large"></ion-icon>
        <h3>{{ hasAnyTasks() ? 'No tasks match your filters' : 'No tasks yet' }}</h3>
        <p>{{ hasAnyTasks() ? 'Try adjusting your search or filter criteria' : 'Create your first task to get started!' }}</p>
        <ion-button fill="solid" (click)="onAddTask()" *ngIf="!hasAnyTasks()">
          <ion-icon name="add" slot="start"></ion-icon>
          Add Task
        </ion-button>
      </div>

      <!-- Task List -->
      <ion-list *ngIf="filteredTasks().length > 0">
        <ion-item-sliding *ngFor="let task of filteredTasks(); trackBy: trackByTaskId">
          <!-- Task Item -->
          <ion-item>
            <ion-checkbox 
              slot="start" 
              [checked]="task.completed" 
              (ionChange)="onToggleComplete(task.id, $event)">
            </ion-checkbox>
            
            <ion-label [class.completed]="task.completed">
              <h2>{{ task.title }}</h2>
              <p *ngIf="task.description">{{ task.description }}</p>
              <div class="task-meta">
                <span class="task-date">{{ formatDate(task.createdAt) }}</span>
                <ion-chip 
                  *ngIf="getCategoryForTask(task.categoryId) as category" 
                  size="small"
                  [color]="category.color">
                  <ion-icon [name]="category.icon"></ion-icon>
                  <ion-label>{{ category.name }}</ion-label>
                </ion-chip>
              </div>
            </ion-label>
            
            <ion-button 
              fill="clear" 
              slot="end" 
              (click)="onEditTask(task)"
              [disabled]="isLoading()">
              <ion-icon name="create" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-item>

          <!-- Slide Options -->
          <ion-item-options side="end">
            <ion-item-option 
              color="primary" 
              (click)="onEditTask(task)">
              <ion-icon name="create" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option 
              color="danger" 
              (click)="onDeleteTask(task.id)">
              <ion-icon name="trash" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="onAddTask()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Inject stores
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);

  // Component signals from stores
  readonly tasks = this.taskStore.tasks;
  readonly filteredTasks = this.taskStore.filteredTasks;
  readonly isLoading = this.taskStore.loading;
  readonly error = this.taskStore.error;
  readonly taskStats = this.taskStore.taskStats;
  readonly searchTerm = this.taskStore.searchTerm;
  readonly selectedCategoryId = this.taskStore.selectedCategoryId;
  readonly categories = this.categoryStore.categories;

  // Local computed signals
  readonly hasAnyTasks = computed(() => this.tasks().length > 0);

  constructor() {
    // Add required Ionic icons
    addIcons({
      checkmarkCircle,
      ellipseOutline,
      trash,
      create,
      search,
      add,
      funnel
    });
  }

  ngOnInit(): void {
    // Load initial data
    this.taskStore.loadTasks();
    this.categoryStore.loadCategories();
  }

  /**
   * Handle search input changes
   */
  onSearchChange(event: any): void {
    const searchTerm = event.target.value;
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
   * Handle task completion toggle
   */
  onToggleComplete(taskId: string, event: any): void {
    const isCompleted = event.detail.checked;
    this.taskStore.toggleTaskCompletion(taskId).subscribe({
      next: (updatedTask) => {
        console.log(`Task ${updatedTask.title} marked as ${isCompleted ? 'completed' : 'pending'}`);
      },
      error: (error) => {
        console.error('Failed to toggle task completion:', error);
        // Optionally show a toast notification
      }
    });
  }

  /**
   * Handle task deletion
   */
  onDeleteTask(taskId: string): void {
    // TODO: Show confirmation dialog
    this.taskStore.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        // Optionally show success toast
      },
      error: (error) => {
        console.error('Failed to delete task:', error);
        // Optionally show error toast
      }
    });
  }

  /**
   * Handle add task action
   */
  onAddTask(): void {
    // TODO: Navigate to task form or open modal
    console.log('Add task clicked');
  }

  /**
   * Handle edit task action
   */
  onEditTask(task: Task): void {
    // TODO: Navigate to task form or open modal with task data
    console.log('Edit task clicked:', task);
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
}