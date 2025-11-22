/**
 * PresentationModule - Angular Module for Presentation Layer
 * 
 * Configures dependency injection for presentation services and stores.
 * Imports the InfrastructureModule to get repository implementations.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { NgModule } from '@angular/core';

// Infrastructure imports
import { InfrastructureModule } from '../infrastructure';

// Application imports - need to ensure use cases are available
import {
  GetAllTasksUseCase,
  GetTaskByIdUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CompleteTaskUseCase,
  GetTasksByCategoryUseCase,
  GetAllCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryStatsUseCase
} from '../application';

// Presentation services
import { TaskStore } from './stores/task.store';
import { CategoryStore } from './stores/category.store';
import { TaskPresentationMapper } from './mappers/task-presentation.mapper';
import { CategoryPresentationMapper } from './mappers/category-presentation.mapper';

/**
 * Presentation Module
 * 
 * Provides:
 * - Store services for reactive state management
 * - Presentation mappers for DTO/Entity conversion
 * - Integration with application and infrastructure layers
 */
@NgModule({
  imports: [
    InfrastructureModule // Provides repository implementations
  ],
  providers: [
    // Use Cases (Application Layer)
    GetAllTasksUseCase,
    GetTaskByIdUseCase,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    CompleteTaskUseCase,
    GetTasksByCategoryUseCase,
    GetAllCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryStatsUseCase,
    
    // Presentation Mappers
    TaskPresentationMapper,
    CategoryPresentationMapper,
    
    // Store Services
    TaskStore,
    CategoryStore
  ]
})
export class PresentationModule {}