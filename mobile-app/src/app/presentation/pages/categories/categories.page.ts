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
import { Category } from '../../../domain/entities/category.entity';
import { CategoryFormModalComponent } from '../../components/category-form-modal/category-form-modal.component';

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
    IonNote,
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
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly modalController = inject(ModalController);

  // Reactive signals from store
  readonly categories = this.categoryStore.categories;
  readonly sortedCategories = this.categoryStore.sortedCategories;
  readonly stats = this.categoryStore.stats;
  readonly loading = this.categoryStore.loading;
  readonly error = this.categoryStore.error;

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
        // Category was created successfully
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
        // Category was updated successfully
        this.loadCategories();
      }
    });

    await modal.present();
  }

  async onDeleteCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteCategory(category.id)
        }
      ]
    });

    await alert.present();
  }

  private async deleteCategory(categoryId: string) {
    try {
      this.categoryStore.deleteCategory(categoryId).subscribe({
        next: () => {
          this.showSuccessToast('Category deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showErrorToast('Error deleting category');
        }
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      this.showErrorToast('Error deleting category');
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