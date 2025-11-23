/**
 * TaskFormComponent - Form for creating and editing tasks
 * 
 * Provides a reactive form for task creation and editing
 * with validation and category selection.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { save, close, checkmark, checkmarkCircle, alertCircle } from 'ionicons/icons';

// Design System imports
import { ButtonComponent, FormFieldComponent } from '@ionic-todo-test/shared-ui';

// Domain imports
import { Task, Category } from '../../../domain';

// Application imports
import { CreateTaskInput, UpdateTaskInput } from '../../../application';

// Presentation imports
import { TaskStore } from '../../stores/task.store';
import { CategoryStore } from '../../stores/category.store';
import { CategorySelectorComponent } from '../category-selector/category-selector.component';

// Infrastructure imports
import { TranslationService } from '../../../infrastructure/services/translation.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CategorySelectorComponent, ButtonComponent, FormFieldComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEditMode() ? translationService.getForms('EDIT_TASK') : translationService.getForms('NEW_TASK') }}</ion-title>
        <ion-buttons slot="start">
          <lib-button 
            variant="clear" 
            size="medium"
            startIcon="close"
            (buttonClick)="onCancel()">
          </lib-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <lib-button 
            variant="clear" 
            size="medium"
            startIcon="checkmark"
            [disabled]="taskForm.invalid || isSubmitting()"
            (buttonClick)="onSubmit()">
          </lib-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <!-- Task Title -->
        <lib-form-field
          [label]="translationService.getForms('TITLE')"
          formControlName="title"
          [placeholder]="translationService.getForms('TITLE_PLACEHOLDER')"
          type="text"
          [maxLength]="100"
          [required]="true"
          [showCharacterCount]="true">
        </lib-form-field>

        <!-- Task Description -->
        <lib-form-field
          [label]="translationService.getForms('DESCRIPTION')"
          formControlName="description"
          [placeholder]="translationService.getForms('DESCRIPTION_PLACEHOLDER')"
          type="textarea"
          [maxLength]="500"
          [helperText]="translationService.getForms('DESCRIPTION_HELPER')"
          [showCharacterCount]="true">
        </lib-form-field>

        <!-- Category Selection -->
        <div class="category-selection-section">
          <h4>{{ translationService.getForms('CATEGORY_SELECTION') }}</h4>
          <app-category-selector
            [selectedCategoryId]="selectedCategorySignal"
            (categorySelected)="onCategorySelected($event)">
          </app-category-selector>
        </div>

        <!-- Error Messages -->
        <ion-card *ngIf="error()" color="danger">
          <ion-card-content>
            <h4>{{ translationService.getCommon('ERROR') }}</h4>
            <p>{{ error() }}</p>
          </ion-card-content>
        </ion-card>

        <!-- Action Buttons (Mobile) -->
        <div class="form-actions ion-margin-top">
          <lib-button 
            variant="primary" 
            size="large"
            expand="full"
            startIcon="save"
            [disabled]="taskForm.invalid || isSubmitting()"
            [loading]="isSubmitting()"
            (buttonClick)="onSubmit()">
            {{ isEditMode() ? translationService.getForms('UPDATE_TASK') : translationService.getForms('CREATE_TASK') }}
          </lib-button>
          
          <lib-button 
            variant="outline" 
            size="large"
            expand="full"
            [disabled]="isSubmitting()"
            (buttonClick)="onCancel()">
            {{ translationService.getCommon('CANCEL') }}
          </lib-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  // Inputs
  @Input() task: Task | null = null;

  // Inject stores and services
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  readonly translationService = inject(TranslationService);

  // Component state
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly categories = this.categoryStore.categories;

  // Form
  taskForm!: FormGroup;

  // Computed properties
  readonly isEditMode = signal(false);
  readonly selectedCategory = signal<Category | null>(null);
  readonly selectedCategorySignal = signal<string | null>(null);

  // Form controls for easier access
  get titleControl() { return this.taskForm.get('title')!; }
  get descriptionControl() { return this.taskForm.get('description')!; }
  get categoryIdControl() { return this.taskForm.get('categoryId')!; }

  constructor() {
    addIcons({ save, close, checkmark, checkmarkCircle, alertCircle });
    this.initializeForm();
  }

  ngOnInit(): void {
    this.isEditMode.set(!!this.task);
    
    // Load categories
    this.categoryStore.loadCategories();
    
    // Setup form with task data if editing
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        categoryId: this.task.categoryId || ''
      });
      this.updateSelectedCategory(this.task.categoryId);
      this.selectedCategorySignal.set(this.task.categoryId || null);
    }
  }

  onCategorySelected(category: Category | null): void {
    const categoryId = category?.id || null;
    this.taskForm.patchValue({ categoryId });
    this.selectedCategorySignal.set(categoryId);
    this.updateSelectedCategory(categoryId);
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categoryId: ['']
    });
  }

  private updateSelectedCategory(categoryId: string | null): void {
    if (categoryId && categoryId !== '') {
      const category = this.categoryStore.getCategoryById(categoryId);
      this.selectedCategory.set(category);
    } else {
      this.selectedCategory.set(null);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    const formValue = this.taskForm.value;
    
    if (this.isEditMode() && this.task) {
      // Update existing task
      const updateInput: UpdateTaskInput = {
        id: this.task.id,
        title: formValue.title,
        description: formValue.description || '',
        categoryId: formValue.categoryId || null
      };

      this.taskStore.updateTask(updateInput).subscribe({
        next: (updatedTask) => {
          console.log('Task updated successfully:', updatedTask);
          this.onSuccess();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      // Create new task
      const createInput: CreateTaskInput = {
        title: formValue.title,
        description: formValue.description || '',
        categoryId: formValue.categoryId || undefined
      };

      this.taskStore.createTask(createInput).subscribe({
        next: (newTask) => {
          console.log('Task created successfully:', newTask);
          this.onSuccess();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onCancel(): void {
    // Navigate back to task list
    this.router.navigate(['/tasks']);
  }

  private async onSuccess(): Promise<void> {
    this.isSubmitting.set(false);
    
    // Show success toast
    const message = this.isEditMode() 
      ? this.translationService.getTasks('UPDATED_SUCCESS')
      : this.translationService.getTasks('CREATED_SUCCESS');
    
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
    
    // Navigate back to task list
    this.router.navigate(['/tasks']);
  }

  private async handleError(error: any): Promise<void> {
    this.isSubmitting.set(false);
    this.error.set(error.message || this.translationService.getTasks('SAVE_ERROR'));
    
    // Show error toast
    const toast = await this.toastController.create({
      message: error.message || this.translationService.getTasks('SAVE_ERROR'),
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      icon: 'alert-circle'
    });
    await toast.present();
    
    console.error('Task form error:', error);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}