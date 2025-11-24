import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonNote,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  AlertController,
  ToastController,
  IonBackButton,
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  search,
  colorPalette,
  create,
  trash,
  arrowBack,
  checkmarkCircle
} from 'ionicons/icons';

import { CategoryStore } from '../../stores/category.store';
import { TaskStore } from '../../stores/task.store';
import { FeatureFlagStore } from '../../stores/feature-flag.store';
import { Category } from '../../../domain/entities/category.entity';
import { CategoryFormModalComponent } from '../../components/category-form-modal/category-form-modal.component';
import { TranslationService } from '../../../infrastructure/services/translation.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSearchbar,
    IonSpinner,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonBackButton,
    IonButtons
  ]
})
export class CategoriesPage implements OnInit {
  private readonly categoryStore = inject(CategoryStore);
  private readonly taskStore = inject(TaskStore);
  private readonly featureFlagStore = inject(FeatureFlagStore);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly modalController = inject(ModalController);
  readonly translationService = inject(TranslationService);

  readonly categories = this.categoryStore.categories;
  readonly sortedCategories = this.categoryStore.sortedCategories;
  readonly stats = this.categoryStore.stats;
  readonly loading = this.categoryStore.loading;
  readonly error = this.categoryStore.error;

  // Feature flags
  readonly statisticsVisible = this.featureFlagStore.statisticsVisible;
  readonly deleteTaskEnabled = this.featureFlagStore.deleteTaskEnabled;

  searchText = '';

  constructor() {
    addIcons({
      add,
      search,
      colorPalette,
      create,
      trash,
      arrowBack,
      checkmarkCircle
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadCategoryStats();
    // Load tasks to ensure accurate task count for validation
    this.taskStore.loadTasksIfNeeded();
  }

  private loadCategories() {
    this.categoryStore.loadCategories();
  }

  onRetryLoad() {
    this.loadCategories();
  }

  private loadCategoryStats() {
    this.categoryStore.loadCategoryStats();
  }

  // For now, we'll use sortedCategories directly instead of search filter
  onSearchChange(event: any) {
    this.searchText = event.detail.value;
    // TODO: Implement search filtering in CategoryStore
  }

  async onCreateCategory() {
    const modal = await this.modalController.create({
      component: CategoryFormModalComponent,
      componentProps: {
        category: null
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadCategories();
      }
    });

    await modal.present();
  }

  async onEditCategory(category: Category) {
    const modal = await this.modalController.create({
      component: CategoryFormModalComponent,
      componentProps: {
        category: category
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadCategories();
      }
    });

    await modal.present();
  }

  async onDeleteCategory(category: Category) {
    const taskCount = this.taskStore.getTaskCountByCategory()(category.id);
    
    if (taskCount > 0) {
      await this.showErrorToast(
        this.translationService.getCategories('CANNOT_DELETE_HAS_TASKS')
      );
      return;
    }

    const alert = await this.alertController.create({
      header: this.translationService.getDialogs('DELETE_CATEGORY'),
      message: this.translationService.getDialogs('DELETE_CATEGORY_CONFIRM').replace('{0}', category.name),
      buttons: [
        {
          text: this.translationService.getCommon('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translationService.getCommon('DELETE'),
          role: 'destructive',
          handler: () => this.deleteCategory(category.id)
        }
      ]
    });

    await alert.present();
  }

  private async deleteCategory(categoryId: string) {
    const taskCount = this.taskStore.getTaskCountByCategory()(categoryId);
    
    if (taskCount > 0) {
      console.error('Cannot delete category - final check failed. Tasks count:', taskCount);
      await this.showErrorToast(
        this.translationService.getCategories('CANNOT_DELETE_HAS_TASKS')
      );
      return;
    }

    try {
      this.categoryStore.deleteCategory(categoryId).subscribe({
        next: () => {
          this.showSuccessToast(this.translationService.getCategories('DELETED_SUCCESS'));
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showErrorToast(this.translationService.getCategories('DELETE_ERROR'));
        }
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      this.showErrorToast(this.translationService.getCategories('DELETE_ERROR'));
    }
  }

  navigateBack() {
    this.router.navigate(['/tasks']);
  }

  private generateRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#A9DFBF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  trackByCategory(index: number, category: Category): string {
    return category.id;
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