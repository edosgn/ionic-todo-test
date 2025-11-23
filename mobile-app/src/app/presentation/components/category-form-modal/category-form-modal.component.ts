/**
 * CategoryFormModalComponent - Advanced modal for creating/editing categories
 * 
 * Provides a comprehensive interface for category management with
 * color selection, icon selection, and form validation.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  ModalController, 
  ToastController,
  AlertController,
  IonHeader,
  IonToolbar, 
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonNote,
  IonList,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, save, checkmarkCircle, trash } from 'ionicons/icons';

import { Category } from '../../../domain/entities/category.entity';
import { CategoryStore } from '../../stores/category.store';
import { TaskStore } from '../../stores/task.store';
import { TranslationService } from '../../../infrastructure/services/translation.service';
import { CreateCategoryInput, UpdateCategoryInput } from '../../../application';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';
import { IconSelectorComponent } from '../icon-selector/icon-selector.component';

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    ColorSelectorComponent,
    IconSelectorComponent
  ],
  templateUrl: './category-form-modal.component.html',
  styleUrls: ['./category-form-modal.component.scss']
})
export class CategoryFormModalComponent implements OnInit {
  @Input() category: Category | null = null;

  // Injected services
  private readonly modalController = inject(ModalController);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly categoryStore = inject(CategoryStore);
  private readonly taskStore = inject(TaskStore);
  private readonly fb = inject(FormBuilder);
  readonly translationService = inject(TranslationService);

  // Component state
  readonly isSubmitting = signal(false);
  readonly isEditMode = signal(false);
  readonly selectedColor = signal('#4ECDC4');
  readonly selectedIcon = signal('folder');
  readonly currentDate = new Date();
  readonly canDeleteCategory = signal(false);
  readonly tasksCount = signal(0);

  // Form
  categoryForm!: FormGroup;

  // Form controls for easier access
  get nameControl() { return this.categoryForm.get('name')!; }

  constructor() {
    addIcons({ close, save, checkmarkCircle, trash });
    this.initializeForm();
  }

  ngOnInit() {
    this.isEditMode.set(!!this.category);
    
    if (this.category) {
      this.loadCategoryData();
      this.checkCategoryTasks();
    }
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  private loadCategoryData(): void {
    if (!this.category) return;

    this.categoryForm.patchValue({
      name: this.category.name
    });

    this.selectedColor.set(this.category.color);
    this.selectedIcon.set(this.category.icon);
  }

  private checkCategoryTasks(): void {
    if (!this.category) {
      this.tasksCount.set(0);
      this.canDeleteCategory.set(true);
      return;
    }

    // Count tasks assigned to this category using TaskStore computed signal
    const count = this.taskStore.getTaskCountByCategory()(this.category.id);
    
    console.log('Category tasks check:', {
      categoryId: this.category.id,
      categoryName: this.category.name,
      tasksCount: count,
      canDelete: count === 0
    });
    
    this.tasksCount.set(count);
    this.canDeleteCategory.set(count === 0);
  }

  onColorSelected(color: string): void {
    this.selectedColor.set(color);
  }

  onIconSelected(icon: string): void {
    this.selectedIcon.set(icon);
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.categoryForm.value;

      if (this.isEditMode() && this.category) {
        await this.updateCategory(formValue);
      } else {
        await this.createCategory(formValue);
      }

      await this.showSuccessToast(
        this.isEditMode() ? 'Category updated successfully' : 'Category created successfully'
      );

      await this.dismissModal(true);
    } catch (error) {
      console.error('Error saving category:', error);
      await this.showErrorToast('Failed to save category');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onDeleteCategory(): Promise<void> {
    if (!this.category) {
      console.error('No category to delete');
      return;
    }

    // Re-check tasks count before proceeding
    this.checkCategoryTasks();
    
    if (!this.canDeleteCategory()) {
      console.log('Cannot delete category - has associated tasks:', this.tasksCount());
      await this.showErrorToast(
        this.translationService.getCategories('CANNOT_DELETE_HAS_TASKS')
      );
      return;
    }

    console.log('Proceeding with category deletion - no associated tasks');

    const alert = await this.alertController.create({
      header: this.translationService.getDialogs('DELETE_CATEGORY'),
      message: this.translationService.getDialogs('DELETE_CATEGORY_CONFIRM').replace('{0}', this.category.name),
      buttons: [
        {
          text: this.translationService.getCommon('CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translationService.getCommon('DELETE'),
          role: 'destructive',
          handler: () => {
            // Double check before proceeding with deletion
            this.checkCategoryTasks();
            if (this.canDeleteCategory()) {
              this.confirmDeleteCategory();
              return true;
            } else {
              // Prevent alert from closing and show error
              this.showErrorToast(
                this.translationService.getCategories('CANNOT_DELETE_HAS_TASKS')
              );
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async confirmDeleteCategory(): Promise<void> {
    if (!this.category) return;

    // Final validation check before deletion
    this.checkCategoryTasks();
    
    if (!this.canDeleteCategory()) {
      console.error('Cannot delete category - final check failed. Tasks count:', this.tasksCount());
      await this.showErrorToast(
        this.translationService.getCategories('CANNOT_DELETE_HAS_TASKS')
      );
      return;
    }

    this.isSubmitting.set(true);

    try {
      await new Promise<void>((resolve, reject) => {
        this.categoryStore.deleteCategory(this.category!.id).subscribe({
          next: () => {
            console.log('Category deleted successfully');
            resolve();
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            reject(error);
          }
        });
      });

      await this.showSuccessToast(
        this.translationService.getCategories('DELETED_SUCCESS')
      );

      await this.dismissModal(true);
    } catch (error) {
      console.error('Error deleting category:', error);
      await this.showErrorToast(
        this.translationService.getCategories('DELETE_ERROR')
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async createCategory(formValue: any): Promise<void> {
    const input: CreateCategoryInput = {
      name: formValue.name.trim(),
      color: this.selectedColor(),
      icon: this.selectedIcon()
    };

    return new Promise((resolve, reject) => {
      this.categoryStore.createCategory(input).subscribe({
        next: () => {
          console.log('Category created successfully');
          resolve();
        },
        error: (error) => {
          console.error('Error creating category:', error);
          reject(error);
        }
      });
    });
  }

  private async updateCategory(formValue: any): Promise<void> {
    if (!this.category) return;

    const input: UpdateCategoryInput = {
      id: this.category.id,
      name: formValue.name.trim(),
      color: this.selectedColor(),
      icon: this.selectedIcon()
    };

    return new Promise((resolve, reject) => {
      this.categoryStore.updateCategory(input).subscribe({
        next: () => resolve(),
        error: reject
      });
    });
  }

  async dismissModal(success: boolean = false): Promise<void> {
    await this.modalController.dismiss(success);
  }

  private async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
}