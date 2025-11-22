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

// Domain imports
import { Task, Category } from '../../../domain';

// Application imports
import { CreateTaskInput, UpdateTaskInput } from '../../../application';

// Presentation imports
import { TaskStore } from '../../stores/task.store';
import { CategoryStore } from '../../stores/category.store';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEditMode() ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="start">
          <ion-button (click)="onCancel()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button 
            [disabled]="taskForm.invalid || isSubmitting()"
            (click)="onSubmit()">
            <ion-icon name="checkmark" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <!-- Task Title -->
        <ion-item>
          <ion-label position="stacked">
            Title <span class="required">*</span>
          </ion-label>
          <ion-input
            formControlName="title"
            placeholder="Enter task title"
            [class.ion-invalid]="titleControl.invalid && titleControl.touched">
          </ion-input>
          <ion-note 
            slot="error" 
            *ngIf="titleControl.invalid && titleControl.touched">
            Title is required and must be at least 2 characters long
          </ion-note>
        </ion-item>

        <!-- Task Description -->
        <ion-item>
          <ion-label position="stacked">Description</ion-label>
          <ion-textarea
            formControlName="description"
            placeholder="Enter task description (optional)"
            [autoGrow]="true"
            rows="3">
          </ion-textarea>
        </ion-item>

        <!-- Category Selection -->
        <ion-item *ngIf="categories().length > 0">
          <ion-label position="stacked">Category</ion-label>
          <ion-select
            formControlName="categoryId"
            placeholder="Select a category (optional)"
            interface="popover">
            <ion-select-option value="">No category</ion-select-option>
            <ion-select-option 
              *ngFor="let category of categories(); trackBy: trackByCategoryId"
              [value]="category.id">
              {{ category.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Selected Category Preview -->
        <div *ngIf="selectedCategory()" class="category-preview">
          <h4>Selected Category</h4>
          <ion-chip [color]="selectedCategory()!.color">
            <ion-icon [name]="selectedCategory()!.icon"></ion-icon>
            <ion-label>{{ selectedCategory()!.name }}</ion-label>
          </ion-chip>
        </div>

        <!-- Error Messages -->
        <ion-card *ngIf="error()" color="danger">
          <ion-card-content>
            <h4>Error</h4>
            <p>{{ error() }}</p>
          </ion-card-content>
        </ion-card>

        <!-- Action Buttons (Mobile) -->
        <div class="form-actions ion-margin-top">
          <ion-button 
            expand="block" 
            fill="solid" 
            type="submit"
            [disabled]="taskForm.invalid || isSubmitting()">
            <ion-icon name="save" slot="start"></ion-icon>
            {{ isSubmitting() ? 'Saving...' : (isEditMode() ? 'Update Task' : 'Create Task') }}
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="outline" 
            (click)="onCancel()"
            [disabled]="isSubmitting()">
            Cancel
          </ion-button>
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

  // Component state
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly categories = this.categoryStore.categories;

  // Form
  taskForm!: FormGroup;

  // Computed properties
  readonly isEditMode = signal(false);
  
  readonly selectedCategory = signal<Category | null>(null);

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
    }

    // Watch for category selection changes
    this.categoryIdControl.valueChanges.subscribe(categoryId => {
      this.updateSelectedCategory(categoryId);
    });
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
    const toast = await this.toastController.create({
      message: this.isEditMode() ? 'Task updated successfully' : 'Task created successfully',
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
    this.error.set(error.message || 'Failed to save task');
    
    // Show error toast
    const toast = await this.toastController.create({
      message: error.message || 'Failed to save task',
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