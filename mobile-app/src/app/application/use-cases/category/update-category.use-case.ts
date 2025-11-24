/**
 * UpdateCategoryUseCase - Updates an existing category
 * 
 * This use case handles the update of category properties with validation
 * and business rules including duplicate name checking.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';

// Domain imports
import { CategoryRepository } from '../../../domain';

// Application imports
import { 
  UpdateCategoryInput, 
  CategoryOutput, 
  UseCase,
  CategoryValidationError,
  CategoryNotFoundError,
  DuplicateCategoryNameError 
} from '../../interfaces';

/**
 * Use case for updating an existing category
 */
@Injectable({
  providedIn: 'root'
})
export class UpdateCategoryUseCase implements UseCase<UpdateCategoryInput, CategoryOutput> {
  
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Executes the category update use case
   * 
   * @param input - The category update parameters
   * @returns Observable that emits the updated category
   * @throws CategoryNotFoundError if category doesn't exist
   * @throws CategoryValidationError if validation fails
   * @throws DuplicateCategoryNameError if name conflicts with existing category
   */
  execute(input: UpdateCategoryInput): Observable<CategoryOutput> {
    this.validateInput(input);
    
    return this.categoryRepository.findById(input.id).pipe(
      switchMap(category => {
        if (!category) {
          return throwError(() => new CategoryNotFoundError(input.id));
        }

        // Validate unique name if name is being changed
        if (input.name !== undefined && input.name !== category.name) {
          return this.validateUniqueName(input.name, input.id).pipe(
            switchMap(() => this.updateCategory(category, input))
          );
        } else {
          return this.updateCategory(category, input);
        }
      })
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: UpdateCategoryInput): void {
    if (!input) {
      throw new CategoryValidationError('input', input, 'Input is required');
    }

    if (!input.id || input.id.trim().length === 0) {
      throw new CategoryValidationError('id', input.id, 'Category ID is required');
    }

    if (input.name !== undefined) {
      if (input.name.trim().length === 0) {
        throw new CategoryValidationError('name', input.name, 'Name cannot be empty');
      }

      if (input.name.trim().length > 50) {
        throw new CategoryValidationError('name', input.name, 'Name cannot exceed 50 characters');
      }
    }

    if (input.color !== undefined) {
      if (input.color.trim().length === 0) {
        throw new CategoryValidationError('color', input.color, 'Color cannot be empty');
      }

      // Validate hex color format
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(input.color)) {
        throw new CategoryValidationError('color', input.color, 'Color must be a valid hex format (e.g., #FF5733)');
      }
    }

    if (input.icon !== undefined && input.icon.trim().length > 50) {
      throw new CategoryValidationError('icon', input.icon, 'Icon name cannot exceed 50 characters');
    }
  }

  /**
   * Validates that the category name is unique (excluding current category)
   */
  private validateUniqueName(name: string, excludeId: string): Observable<void> {
    return this.categoryRepository.findAll().pipe(
      map(categories => {
        const duplicateName = categories.find(cat => 
          cat.id !== excludeId && 
          cat.name.toLowerCase() === name.trim().toLowerCase()
        );
        
        if (duplicateName) {
          throw new DuplicateCategoryNameError(name.trim());
        }
        
        return void 0;
      })
    );
  }

  /**
   * Updates the category with new values
   */
  private updateCategory(category: any, input: UpdateCategoryInput): Observable<CategoryOutput> {
    // Update properties only if they're provided
    if (input.name !== undefined) {
      category.name = input.name.trim();
    }

    if (input.color !== undefined) {
      category.color = input.color;
    }

    if (input.icon !== undefined) {
      category.icon = input.icon.trim() || 'folder';
    }

    // Update timestamp
    category.updatedAt = new Date();

    // Save updated category
    return this.categoryRepository.update(category).pipe(
      map(updatedCategory => this.mapCategoryToOutput(updatedCategory))
    );
  }

  /**
   * Maps a Category entity to CategoryOutput DTO
   */
  private mapCategoryToOutput(category: any): CategoryOutput {
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }
}