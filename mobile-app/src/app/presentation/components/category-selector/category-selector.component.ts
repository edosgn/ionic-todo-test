/**
 * CategorySelectorComponent - Category selection component for task forms
 * 
 * Provides a clean interface for selecting categories in task creation/editing
 * with visual indicators for colors and icons.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonCheckbox,
  IonButton,
  IonText,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';

import { Category } from '../../../domain/entities/category.entity';
import { CategoryStore } from '../../stores/category.store';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonIcon,
    IonText
  ],
  template: `
    <div class="category-selector">
      <!-- None/Clear Option -->
      <ion-item 
        button 
        (click)="selectCategory(null)"
        [class.selected]="selectedCategoryId() === null"
        class="category-item">
        <div class="category-indicator" slot="start">
          <div class="category-color-circle no-category"></div>
          <ion-icon name="close" class="category-icon"></ion-icon>
        </div>
        <ion-label>
          <h3>No Category</h3>
          <p>Tasks without category</p>
        </ion-label>
        <ion-icon 
          slot="end" 
          [name]="selectedCategoryId() === null ? 'checkmark-circle' : 'ellipse-outline'"
          [color]="selectedCategoryId() === null ? 'primary' : 'medium'">
        </ion-icon>
      </ion-item>

      <!-- Available Categories -->
      <ion-item 
        *ngFor="let category of categories(); trackBy: trackByCategoryId" 
        button 
        (click)="selectCategory(category)"
        [class.selected]="selectedCategoryId() === category.id"
        class="category-item">
        
        <div class="category-indicator" slot="start">
          <div 
            class="category-color-circle" 
            [style.background-color]="category.color">
          </div>
          <ion-icon [name]="category.icon" class="category-icon"></ion-icon>
        </div>
        
        <ion-label>
          <h3>{{ category.name }}</h3>
          <p>{{ category.createdAt | date:'mediumDate' }}</p>
        </ion-label>

        <ion-icon 
          slot="end" 
          [name]="selectedCategoryId() === category.id ? 'checkmark-circle' : 'ellipse-outline'"
          [color]="selectedCategoryId() === category.id ? 'primary' : 'medium'">
        </ion-icon>
      </ion-item>

      <!-- Empty State -->
      <div *ngIf="categories().length === 0" class="empty-categories">
        <ion-text color="medium">
          <p>No categories available</p>
          <small>Create categories first to organize your tasks</small>
        </ion-text>
      </div>
    </div>
  `,
  styles: [`
    .category-selector {
      width: 100%;
    }

    .category-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 60px;
      margin: 4px 0;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .category-item.selected {
      --background: var(--ion-color-primary-tint);
      --color: var(--ion-color-primary-contrast);
    }

    .category-item:hover {
      --background: var(--ion-color-light);
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
      position: relative;
    }

    .category-color-circle.no-category {
      background: var(--ion-color-light);
      border: 2px dashed var(--ion-color-medium);
    }

    .category-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      color: var(--ion-color-primary);
    }

    .empty-categories {
      text-align: center;
      padding: 20px;
    }

    .empty-categories p {
      margin: 0 0 4px 0;
    }

    .empty-categories small {
      opacity: 0.7;
    }
  `]
})
export class CategorySelectorComponent {
  @Input() selectedCategoryId = signal<string | null>(null);
  @Input() showNoneOption = true;
  @Output() categorySelected = new EventEmitter<Category | null>();

  // Inject category store
  private readonly categoryStore = inject(CategoryStore);

  // Get categories from store
  readonly categories = this.categoryStore.categories;

  constructor() {
    addIcons({ checkmarkCircle, ellipseOutline });
    
    // Load categories when component initializes
    this.categoryStore.loadCategories();
  }

  selectCategory(category: Category | null): void {
    this.selectedCategoryId.set(category?.id || null);
    this.categorySelected.emit(category);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}