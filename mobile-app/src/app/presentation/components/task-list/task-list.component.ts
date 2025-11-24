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
  appsOutline,
  checkboxOutline,
  refresh
} from 'ionicons/icons';

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
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './task-list.component.html',
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
      appsOutline,
      checkboxOutline,
      refresh
    });
  }

  ngOnInit(): void {
    // Load initial data only if needed
    this.taskStore.loadTasksIfNeeded();
    this.categoryStore.loadCategories();
  }

  /**
   * Handle search input changes
   */
  onSearchInputChange(term: string): void {
    this.taskStore.setSearchTerm(term);
  }

  /**
   * Handle category change from segment
   */
  onCategoryChange(value: any): void {
    const categoryId = typeof value === 'string' ? value : String(value);
    if (categoryId === 'all' || !categoryId) {
      this.taskStore.setCategoryFilter(null);
    } else {
      this.taskStore.setCategoryFilter(categoryId);
    }
  }

  /**
   * Handle retry action
   */
  onRetry(): void {
    this.taskStore.loadTasks();
  }

  /**
   * Handle add task action
   */
  onAddTask(): void {
    this.router.navigate(['/task/new']);
  }

  /**
   * Handle task completion toggle
   */
  onToggleComplete(taskId: string, completed: boolean): void {
    this.taskStore.toggleTaskCompletion(taskId);
  }

  /**
   * Handle edit task action
   */
  onEditTask(taskId: string): void {
    this.router.navigate(['/task', taskId, 'edit']);
  }

  /**
   * Handle delete task action
   */
  async onDeleteTask(taskId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translationService.getDialogs('DELETE_TASK'),
      message: this.translationService.getDialogs('DELETE_TASK_CONFIRM'),
      buttons: [
        {
          text: this.translationService.getCommon('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translationService.getCommon('DELETE'),
          role: 'destructive',
          handler: () => this.deleteTask(taskId)
        }
      ]
    });

    await alert.present();
  }

  private async deleteTask(taskId: string) {
    try {
      this.taskStore.deleteTask(taskId).subscribe({
        next: () => {
          this.showSuccessToast(this.translationService.getTasks('DELETED_SUCCESS'));
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.showErrorToast(this.translationService.getTasks('DELETE_ERROR'));
        }
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      this.showErrorToast(this.translationService.getTasks('DELETE_ERROR'));
    }
  }

  /**
   * Get category for a task
   */
  getCategoryForTask(categoryId: string | null) {
    if (!categoryId) return null;
    return this.categories().find(cat => cat.id === categoryId);
  }

  /**
   * Track by function for ngFor
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
}