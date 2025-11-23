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
import { close, save, checkmarkCircle } from 'ionicons/icons';

import { Category } from '../../../domain/entities/category.entity';
import { CategoryStore } from '../../stores/category.store';
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
  private readonly categoryStore = inject(CategoryStore);
  private readonly fb = inject(FormBuilder);

  // Component state
  readonly isSubmitting = signal(false);
  readonly isEditMode = signal(false);
  readonly selectedColor = signal('#4ECDC4');
  readonly selectedIcon = signal('folder');
  readonly currentDate = new Date();

  // Form
  categoryForm!: FormGroup;

  // Form controls for easier access
  get nameControl() { return this.categoryForm.get('name')!; }

  constructor() {
    addIcons({ close, save, checkmarkCircle });
    this.initializeForm();
  }

  ngOnInit() {
    this.isEditMode.set(!!this.category);
    
    if (this.category) {
      this.loadCategoryData();
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