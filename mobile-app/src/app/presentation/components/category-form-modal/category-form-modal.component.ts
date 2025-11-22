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
    IonTextarea,
    IonNote,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    ColorSelectorComponent,
    IconSelectorComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEditMode() ? 'Edit Category' : 'New Category' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismissModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <!-- Basic Information -->
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Category Name *</ion-label>
            <ion-input
              formControlName="name"
              placeholder="Enter category name"
              [class.ion-invalid]="nameControl.invalid && nameControl.touched"
              maxlength="50">
            </ion-input>
            <ion-note 
              slot="error" 
              *ngIf="nameControl.invalid && nameControl.touched">
              Category name is required (3-50 characters)
            </ion-note>
          </ion-item>
        </ion-list>

        <!-- Color & Icon Selection -->
        <ion-accordion-group class="styling-accordion">
          <ion-accordion value="color">
            <ion-item slot="header">
              <ion-label>
                <h3>Color Selection</h3>
                <p>Choose a color to represent this category</p>
              </ion-label>
              <div class="color-preview" slot="end">
                <div 
                  class="color-circle"
                  [style.background-color]="selectedColor()">
                </div>
              </div>
            </ion-item>
            <div slot="content" class="accordion-content">
              <app-color-selector
                [selectedColor]="selectedColor"
                (colorSelected)="onColorSelected($event)">
              </app-color-selector>
            </div>
          </ion-accordion>

          <ion-accordion value="icon">
            <ion-item slot="header">
              <ion-label>
                <h3>Icon Selection</h3>
                <p>Pick an icon to identify this category</p>
              </ion-label>
              <ion-icon 
                [name]="selectedIcon()" 
                slot="end" 
                class="icon-preview">
              </ion-icon>
            </ion-item>
            <div slot="content" class="accordion-content">
              <app-icon-selector
                [selectedIcon]="selectedIcon"
                (iconSelected)="onIconSelected($event)">
              </app-icon-selector>
            </div>
          </ion-accordion>
        </ion-accordion-group>

        <!-- Category Preview -->
        <div class="category-preview">
          <h4>Preview</h4>
          <ion-item class="preview-item">
            <div class="category-indicator" slot="start">
              <div 
                class="category-color-circle"
                [style.background-color]="selectedColor()">
              </div>
              <ion-icon [name]="selectedIcon()" class="category-icon"></ion-icon>
            </div>
            <ion-label>
              <h3>{{ categoryForm.value.name || 'Category Name' }}</h3>
              <p>Created {{ new Date() | date:'mediumDate' }}</p>
            </ion-label>
          </ion-item>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button 
            expand="block" 
            type="submit"
            [disabled]="categoryForm.invalid || isSubmitting()"
            class="submit-button">
            <ion-icon name="save" slot="start"></ion-icon>
            {{ isEditMode() ? 'Update Category' : 'Create Category' }}
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="clear" 
            (click)="dismissModal()"
            [disabled]="isSubmitting()">
            Cancel
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styles: [`
    .styling-accordion {
      margin: 16px 0;
    }

    .accordion-content {
      padding: 0;
    }

    .color-preview {
      display: flex;
      align-items: center;
    }

    .color-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-medium);
    }

    .icon-preview {
      font-size: 20px;
      color: var(--ion-color-primary);
    }

    .category-preview {
      margin: 24px 0;
      padding: 16px;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    .category-preview h4 {
      margin: 0 0 12px 0;
      color: var(--ion-color-medium);
    }

    .preview-item {
      --padding-start: 0;
      --padding-end: 0;
      --inner-padding-end: 0;
      margin: 0;
    }

    .category-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .category-color-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-medium);
    }

    .category-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      color: var(--ion-color-primary);
    }

    .action-buttons {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--ion-color-medium);
    }

    .action-buttons ion-button {
      margin-bottom: 8px;
    }

    .submit-button {
      --background: var(--ion-color-primary);
      --color: var(--ion-color-primary-contrast);
    }
  `]
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
        next: () => resolve(),
        error: reject
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