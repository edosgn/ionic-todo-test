/**
 * CreateCategoryUseCase - Creates a new category
 * 
 * This use case handles the creation of new categories with validation
 * and business rules including duplicate name checking.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

// Domain imports
import { Category, CategoryRepository, CategoryId } from '../../../domain';

// Application imports
import { 
  CreateCategoryInput, 
  CategoryOutput, 
  UseCase,
  CategoryValidationError,
  DuplicateCategoryNameError 
} from '../../interfaces';

/**
 * Use case for creating a new category
 */
@Injectable({
  providedIn: 'root'
})
export class CreateCategoryUseCase implements UseCase<CreateCategoryInput, CategoryOutput> {
  
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Executes the category creation use case
   * 
   * @param input - The category creation parameters
   * @returns Observable that emits the created category
   * @throws CategoryValidationError if validation fails
   * @throws DuplicateCategoryNameError if name already exists
   */
  execute(input: CreateCategoryInput): Observable<CategoryOutput> {
    this.validateInput(input);
    
    // Check for duplicate name
    return this.validateUniqueeName(input.name).pipe(
      switchMap(() => this.createAndSaveCategory(input))
    );
  }

  /**
   * Validates the input parameters
   */
  private validateInput(input: CreateCategoryInput): void {
    if (!input) {
      throw new CategoryValidationError('input', input, 'Input is required');
    }

    if (!input.name || input.name.trim().length === 0) {
      throw new CategoryValidationError('name', input.name, 'Name is required and cannot be empty');
    }

    if (input.name.trim().length > 50) {
      throw new CategoryValidationError('name', input.name, 'Name cannot exceed 50 characters');
    }

    if (!input.color || input.color.trim().length === 0) {
      throw new CategoryValidationError('color', input.color, 'Color is required');
    }

    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(input.color)) {
      throw new CategoryValidationError('color', input.color, 'Color must be a valid hex format (e.g., #FF5733)');
    }

    // Validate icon if provided
    if (input.icon && input.icon.trim().length > 50) {
      throw new CategoryValidationError('icon', input.icon, 'Icon name cannot exceed 50 characters');
    }
  }

  /**
   * Validates that the category name is unique
   */
  private validateUniqueeName(name: string): Observable<void> {
    return this.categoryRepository.findAll().pipe(
      map(categories => {
        const duplicateName = categories.find(cat => 
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
   * Creates and saves the new category
   */
  private createAndSaveCategory(input: CreateCategoryInput): Observable<CategoryOutput> {
    // Generate unique ID for the new category
    const categoryId = CategoryId.generate();
    
    // Create new category entity using static factory method
    const category = Category.create(
      categoryId.getValue(),
      input.name.trim(),
      input.color,
      input.icon || 'folder'
    );

    // Save category and return as output DTO
    return this.categoryRepository.save(category).pipe(
      map(savedCategory => this.mapCategoryToOutput(savedCategory))
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