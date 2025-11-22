/**
 * TaskMapper - Presentation Layer
 * 
 * Maps between application layer DTOs and domain entities
 * for the presentation layer to work with rich domain objects.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Task } from '../../domain';
import { TaskOutput } from '../../application';

/**
 * Service to map between TaskOutput DTOs and Task domain entities
 */
@Injectable({
  providedIn: 'root'
})
export class TaskPresentationMapper {
  
  /**
   * Convert TaskOutput DTO to Task domain entity
   */
  toDomain(dto: TaskOutput): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description,
      dto.completed,
      dto.categoryId,
      dto.createdAt,
      dto.updatedAt
    );
  }

  /**
   * Convert array of TaskOutput DTOs to Task domain entities
   */
  toDomainArray(dtos: TaskOutput[]): Task[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}