/**
 * TaskMapper - Maps between Task entity and TaskDTO
 * 
 * Handles conversion between domain entities and storage DTOs.
 * This implements the Mapper pattern to keep domain and infrastructure layers decoupled.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Task } from '../../domain';
import { TaskDTO } from '../adapters/storage/storage.types';

/**
 * Mapper service for Task entity <-> TaskDTO conversion
 */
@Injectable({
  providedIn: 'root'
})
export class TaskMapper {

  /**
   * Convert Task entity to TaskDTO for storage
   * 
   * @param entity - Task entity from domain
   * @returns TaskDTO for storage
   */
  toDTO(entity: Task): TaskDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      completed: entity.completed,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convert TaskDTO to Task entity for domain use
   * 
   * @param dto - TaskDTO from storage
   * @returns Task entity for domain
   */
  toDomain(dto: TaskDTO): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description,
      dto.completed,
      dto.categoryId,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  /**
   * Convert array of Task entities to TaskDTO array
   * 
   * @param entities - Array of Task entities
   * @returns Array of TaskDTOs
   */
  toDTOArray(entities: Task[]): TaskDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }

  /**
   * Convert array of TaskDTOs to Task entity array
   * 
   * @param dtos - Array of TaskDTOs
   * @returns Array of Task entities
   */
  toDomainArray(dtos: TaskDTO[]): Task[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Validate TaskDTO structure before mapping to domain
   * 
   * @param dto - TaskDTO to validate
   * @returns true if valid, false otherwise
   */
  validateDTO(dto: any): dto is TaskDTO {
    return dto &&
           typeof dto.id === 'string' &&
           typeof dto.title === 'string' &&
           typeof dto.description === 'string' &&
           typeof dto.completed === 'boolean' &&
           (dto.categoryId === null || typeof dto.categoryId === 'string') &&
           typeof dto.createdAt === 'string' &&
           typeof dto.updatedAt === 'string' &&
           !isNaN(Date.parse(dto.createdAt)) &&
           !isNaN(Date.parse(dto.updatedAt));
  }

  /**
   * Safely convert potentially invalid DTO to domain entity
   * 
   * @param dto - Potentially invalid DTO
   * @returns Task entity or null if invalid
   */
  safeToDomain(dto: any): Task | null {
    if (!this.validateDTO(dto)) {
      console.warn('Invalid TaskDTO structure:', dto);
      return null;
    }

    try {
      return this.toDomain(dto);
    } catch (error) {
      console.error('Error converting TaskDTO to domain:', error, dto);
      return null;
    }
  }

  /**
   * Safely convert array of potentially invalid DTOs to domain entities
   * 
   * @param dtos - Array of potentially invalid DTOs
   * @returns Array of valid Task entities (invalid ones are filtered out)
   */
  safeToDomainArray(dtos: any[]): Task[] {
    if (!Array.isArray(dtos)) {
      console.warn('Expected array of TaskDTOs, got:', typeof dtos);
      return [];
    }

    return dtos
      .map(dto => this.safeToDomain(dto))
      .filter((task): task is Task => task !== null);
  }
}