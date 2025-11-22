/**
 * TaskCardComponent - Organism for individual task display
 * 
 * Complex organism that combines multiple atoms and molecules from the design system
 * to create a comprehensive task card with completion status, metadata, actions,
 * and category information.
 * 
 * Features:
 * - Checkbox integration with completion state
 * - Title and description display with overflow handling
 * - Category badge with color and icon
 * - Date formatting and display
 * - Action buttons for edit and delete
 * - Swipe actions for mobile interaction
 * - Loading and disabled states
 * - Accessibility compliance with ARIA attributes
 * - Glass-morphism design with modern animations
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IconComponent, ButtonComponent, BadgeComponent, BadgeVariant } from '../../atoms';

// Task and Category interfaces
export interface TaskCardData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  categoryId: string | null;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TaskCardActions {
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onCardClick?: (taskId: string) => void;
}

@Component({
  selector: 'lib-task-card',
  standalone: true,
  imports: [CommonModule, IonicModule, IconComponent, ButtonComponent, BadgeComponent],
  template: `
    <div 
      class="lib-task-card"
      [class.lib-task-card--completed]="task.completed"
      [class.lib-task-card--loading]="loading"
      [class.lib-task-card--interactive]="interactive"
      [attr.role]="interactive ? 'button' : null"
      [attr.tabindex]="interactive ? 0 : -1"
      [attr.aria-label]="interactive ? 'Task: ' + task.title : null"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()">
      
      <!-- Loading Overlay -->
      <div *ngIf="loading" class="lib-task-card__loading">
        <ion-spinner name="dots"></ion-spinner>
      </div>

      <!-- Main Content -->
      <div class="lib-task-card__content">
        <!-- Checkbox Section -->
        <div class="lib-task-card__checkbox">
          <ion-checkbox
            [checked]="task.completed"
            [disabled]="loading || disabled"
            (ionChange)="onToggleComplete($event)"
            [attr.aria-label]="'Mark task ' + task.title + ' as ' + (task.completed ? 'pending' : 'completed')">
          </ion-checkbox>
        </div>

        <!-- Task Info Section -->
        <div class="lib-task-card__info">
          <!-- Title and Description -->
          <div class="lib-task-card__text">
            <h3 
              class="lib-task-card__title"
              [class.lib-task-card__title--completed]="task.completed">
              {{ task.title }}
            </h3>
            <p 
              *ngIf="task.description && showDescription" 
              class="lib-task-card__description"
              [class.lib-task-card__description--completed]="task.completed">
              {{ task.description }}
            </p>
          </div>

          <!-- Metadata -->
          <div class="lib-task-card__metadata">
            <!-- Date -->
            <span class="lib-task-card__date">
              <lib-icon 
                name="calendar-outline" 
                size="sm" 
                color="medium">
              </lib-icon>
              {{ formatDate(task.createdAt) }}
            </span>

            <!-- Category Badge -->
            <lib-badge
              *ngIf="category"
              [variant]="mapCategoryColorToVariant(category.color)"
              size="sm"
              class="lib-task-card__category">
              <lib-icon 
                [name]="category.icon" 
                size="xs" 
                style="margin-right: 4px;">
              </lib-icon>
              {{ category.name }}
            </lib-badge>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="lib-task-card__actions" *ngIf="showActions">
          <!-- Edit Button -->
          <lib-button
            variant="clear"
            size="small"
            startIcon="create"
            [disabled]="loading || disabled"
            [attr.aria-label]="'Edit task ' + task.title"
            (buttonClick)="onEditTask()"
            class="lib-task-card__action-btn">
          </lib-button>

          <!-- Delete Button -->
          <lib-button
            variant="clear"
            size="small"
            startIcon="trash"
            color="danger"
            [disabled]="loading || disabled"
            [attr.aria-label]="'Delete task ' + task.title"
            (buttonClick)="onDeleteTask()"
            class="lib-task-card__action-btn">
          </lib-button>
        </div>
      </div>

      <!-- Completion Status Indicator -->
      <div 
        class="lib-task-card__status"
        [class.lib-task-card__status--completed]="task.completed">
      </div>
    </div>
  `,
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  // Input Properties
  @Input({ required: true }) task!: TaskCardData;
  @Input() category: TaskCategory | null = null;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() interactive = false;
  @Input() showActions = true;
  @Input() showDescription = true;
  @Input() dateFormat: 'short' | 'medium' | 'long' = 'short';

  // Output Events
  @Output() toggleComplete = new EventEmitter<{ taskId: string; completed: boolean }>();
  @Output() editTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() cardClick = new EventEmitter<string>();

  /**
   * Handle checkbox completion toggle
   */
  onToggleComplete(event: { detail: { checked: boolean } }): void {
    if (this.loading || this.disabled) return;
    
    const completed = event.detail.checked;
    this.toggleComplete.emit({
      taskId: this.task.id,
      completed
    });
  }

  /**
   * Handle edit task action
   */
  onEditTask(): void {
    if (this.loading || this.disabled) return;
    this.editTask.emit(this.task.id);
  }

  /**
   * Handle delete task action
   */
  onDeleteTask(): void {
    if (this.loading || this.disabled) return;
    this.deleteTask.emit(this.task.id);
  }

  /**
   * Handle card click (when interactive)
   */
  onCardClick(): void {
    if (this.interactive && !this.loading && !this.disabled) {
      this.cardClick.emit(this.task.id);
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (this.dateFormat) {
      case 'short':
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      case 'medium':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
      
      case 'long':
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      
      default:
        return date.toLocaleDateString();
    }
  }

  /**
   * Map category color to valid badge variant
   */
  mapCategoryColorToVariant(color: string): BadgeVariant {
    const validVariants: BadgeVariant[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'];
    
    // If color is already a valid variant, return it
    if (validVariants.includes(color as BadgeVariant)) {
      return color as BadgeVariant;
    }
    
    // Map common color names to variants
    const colorMap: Record<string, BadgeVariant> = {
      'blue': 'primary',
      'green': 'success',
      'red': 'danger',
      'orange': 'warning',
      'yellow': 'warning',
      'purple': 'secondary',
      'gray': 'light',
      'black': 'dark'
    };
    
    return colorMap[color.toLowerCase()] || 'primary';
  }
}