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
  IonButtons
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
import { CreateCategoryInput, UpdateCategoryInput } from '../../../application';

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
    const alert = await this.alertController.create({
      header: 'New Category',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Category name',
          attributes: {
            maxlength: 50
          }
        },
        {
          name: 'color',
          type: 'text',
          placeholder: 'Color (e.g., #FF5733)',
          value: this.generateRandomColor()
        },
        {
          name: 'icon',
          type: 'text',
          placeholder: 'Icon name (e.g., folder)',
          value: 'folder'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: (data) => this.createCategory(data)
        }
      ]
    });

    await alert.present();
  }

  private async createCategory(data: { name: string; color: string; icon: string }) {
    if (!data.name?.trim()) {
      this.showErrorToast('Category name is required');
      return false;
    }

    const input: CreateCategoryInput = {
      name: data.name.trim(),
      color: data.color || this.generateRandomColor(),
      icon: data.icon || 'folder'
    };

    try {
      this.categoryStore.createCategory(input).subscribe({
        next: () => {
          this.showSuccessToast('Category created successfully');
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.showErrorToast('Error creating category');
        }
      });
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      this.showErrorToast('Error creating category');
      return false;
    }
  }

  async onEditCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Edit Category',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Category name',
          attributes: {
            maxlength: 50
          }
        },
        {
          name: 'color',
          type: 'text',
          value: category.color,
          placeholder: 'Color (e.g., #FF5733)'
        },
        {
          name: 'icon',
          type: 'text',
          value: category.icon,
          placeholder: 'Icon name (e.g., folder)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: (data) => this.updateCategory(category.id, data)
        }
      ]
    });

    await alert.present();
  }

  private async updateCategory(
    categoryId: string, 
    data: { name: string; color: string; icon: string }
  ) {
    if (!data.name?.trim()) {
      this.showErrorToast('Category name is required');
      return false;
    }

    const input: UpdateCategoryInput = {
      id: categoryId,
      name: data.name.trim(),
      color: data.color || this.generateRandomColor(),
      icon: data.icon || 'folder'
    };

    try {
      this.categoryStore.updateCategory(input).subscribe({
        next: () => {
          this.showSuccessToast('Category updated successfully');
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.showErrorToast('Error updating category');
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      this.showErrorToast('Error updating category');
      return false;
    }
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