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
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
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