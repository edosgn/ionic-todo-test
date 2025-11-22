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
  funnel
} from 'ionicons/icons';

// Design System imports
import { ButtonComponent, IconComponent, BadgeComponent } from '@ionic-todo-test/shared-ui';

// Domain imports
import { Task } from '../../../domain';

// Presentation imports
import { TaskStore } from '../../stores/task.store';
import { CategoryStore } from '../../stores/category.store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ButtonComponent, IconComponent, BadgeComponent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <lib-button 
            variant="clear" 
            size="medium"
            startIcon="add"
            (buttonClick)="onAddTask()">
          </lib-button>
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
          <lib-button 
            variant="clear" 
            startIcon="refresh"
            (buttonClick)="onRetry()">
            Retry
          </lib-button>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !error() && filteredTasks().length === 0" class="empty-state">
        <ion-icon name="checkbox-outline" size="large"></ion-icon>
        <h3>{{ hasAnyTasks() ? 'No tasks match your filters' : 'No tasks yet' }}</h3>
        <p>{{ hasAnyTasks() ? 'Try adjusting your search or filter criteria' : 'Create your first task to get started!' }}</p>
        <lib-button 
          variant="primary" 
          startIcon="add"
          (buttonClick)="onAddTask()" 
          *ngIf="!hasAnyTasks()">
          Add Task
        </lib-button>
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
            
            <lib-button 
              variant="clear" 
              size="medium"
              startIcon="create"
              [disabled]="isLoading()"
              (buttonClick)="onEditTask(task)">
            </lib-button>
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
  // Inject stores and services
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

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
   * Handle task completion toggle with feedback
   */
  onToggleComplete(taskId: string, event: any): void {
    const isCompleted = event.detail.checked;
    this.taskStore.toggleTaskCompletion(taskId).subscribe({
      next: async (updatedTask) => {
        const toast = await this.toastController.create({
          message: `Task marked as ${isCompleted ? 'completed' : 'pending'}`,
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
          message: 'Failed to update task',
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
      header: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
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
          message: 'Task deleted successfully',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Failed to delete task:', error);
        const toast = await this.toastController.create({
          message: 'Failed to delete task',
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
  onAddTask(): void {
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
}