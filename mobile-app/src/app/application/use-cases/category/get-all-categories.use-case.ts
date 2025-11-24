/**
 * GetAllCategoriesUseCase - Retrieves all categories
 * 
 * This use case handles the retrieval of all categories with optional sorting.
 * It follows the Query pattern and provides data for read operations.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Domain imports
import { CategoryRepository } from '../../../domain';

// Application imports
import { 
  CategoryOutput, 
  NoInputUseCase 
} from '../../interfaces';

/**
 * Use case for retrieving all categories
 */
@Injectable({
  providedIn: 'root'
})
export class GetAllCategoriesUseCase implements NoInputUseCase<CategoryOutput[]> {
  
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Executes the get all categories use case
   * 
   * @returns Observable that emits an array of all categories
   */
  execute(): Observable<CategoryOutput[]> {
    return this.categoryRepository.findAll().pipe(
      map(categories => categories.map(category => this.mapCategoryToOutput(category)))
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