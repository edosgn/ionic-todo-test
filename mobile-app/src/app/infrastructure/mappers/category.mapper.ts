/**
 * CategoryMapper - Maps between Category entity and CategoryDTO
 * 
 * Handles conversion between domain entities and storage DTOs.
 * This implements the Mapper pattern to keep domain and infrastructure layers decoupled.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Category } from '../../domain';
import { CategoryDTO } from '../adapters/storage/storage.types';

/**
 * Mapper service for Category entity <-> CategoryDTO conversion
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryMapper {

  /**
   * Convert Category entity to CategoryDTO for storage
   * 
   * @param entity - Category entity from domain
   * @returns CategoryDTO for storage
   */
  toDTO(entity: Category): CategoryDTO {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color,
      icon: entity.icon,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convert CategoryDTO to Category entity for domain use
   * 
   * @param dto - CategoryDTO from storage
   * @returns Category entity for domain
   */
  toDomain(dto: CategoryDTO): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.color,
      dto.icon,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  /**
   * Convert array of Category entities to CategoryDTO array
   * 
   * @param entities - Array of Category entities
   * @returns Array of CategoryDTOs
   */
  toDTOArray(entities: Category[]): CategoryDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }

  /**
   * Convert array of CategoryDTOs to Category entity array
   * 
   * @param dtos - Array of CategoryDTOs
   * @returns Array of Category entities
   */
  toDomainArray(dtos: CategoryDTO[]): Category[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Validate CategoryDTO structure before mapping to domain
   * 
   * @param dto - CategoryDTO to validate
   * @returns true if valid, false otherwise
   */
  validateDTO(dto: any): dto is CategoryDTO {
    return dto &&
           typeof dto.id === 'string' &&
           typeof dto.name === 'string' &&
           typeof dto.color === 'string' &&
           typeof dto.icon === 'string' &&
           typeof dto.createdAt === 'string' &&
           typeof dto.updatedAt === 'string' &&
           !isNaN(Date.parse(dto.createdAt)) &&
           !isNaN(Date.parse(dto.updatedAt)) &&
           this.validateHexColor(dto.color);
  }

  /**
   * Validate hex color format
   * 
   * @param color - Color string to validate
   * @returns true if valid hex color
   */
  private validateHexColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  /**
   * Safely convert potentially invalid DTO to domain entity
   * 
   * @param dto - Potentially invalid DTO
   * @returns Category entity or null if invalid
   */
  safeToDomain(dto: any): Category | null {
    if (!this.validateDTO(dto)) {
      console.warn('Invalid CategoryDTO structure:', dto);
      return null;
    }

    try {
      return this.toDomain(dto);
    } catch (error) {
      console.error('Error converting CategoryDTO to domain:', error, dto);
      return null;
    }
  }

  /**
   * Safely convert array of potentially invalid DTOs to domain entities
   * 
   * @param dtos - Array of potentially invalid DTOs
   * @returns Array of valid Category entities (invalid ones are filtered out)
   */
  safeToDomainArray(dtos: any[]): Category[] {
    if (!Array.isArray(dtos)) {
      console.warn('Expected array of CategoryDTOs, got:', typeof dtos);
      return [];
    }

    return dtos
      .map(dto => this.safeToDomain(dto))
      .filter((category): category is Category => category !== null);
  }
}