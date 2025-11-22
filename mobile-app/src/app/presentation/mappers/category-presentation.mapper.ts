/**
 * CategoryMapper - Presentation Layer
 * 
 * Maps between application layer DTOs and domain entities
 * for the presentation layer to work with rich domain objects.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Category } from '../../domain';
import { CategoryOutput } from '../../application';

/**
 * Service to map between CategoryOutput DTOs and Category domain entities
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryPresentationMapper {
  
  /**
   * Convert CategoryOutput DTO to Category domain entity
   */
  toDomain(dto: CategoryOutput): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.color,
      dto.icon,
      dto.createdAt,
      dto.updatedAt
    );
  }

  /**
   * Convert array of CategoryOutput DTOs to Category domain entities
   */
  toDomainArray(dtos: CategoryOutput[]): Category[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}