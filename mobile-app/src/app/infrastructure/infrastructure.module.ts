/**
 * InfrastructureModule - Angular Module for Infrastructure Layer
 * 
 * Configures dependency injection for infrastructure services,
 * repository implementations, and mappers. This module should be
 * imported by the application module to provide concrete implementations
 * for domain repository interfaces.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { NgModule, InjectionToken } from '@angular/core';

// Domain Interfaces
import { TaskRepository, CategoryRepository } from '../domain';

// Infrastructure Implementations
import { StorageService } from './adapters/storage/storage.service';
import { TaskRepositoryImpl } from './adapters/repositories/task.repository.impl';
import { CategoryRepositoryImpl } from './adapters/repositories/category.repository.impl';
import { TaskMapper } from './mappers/task.mapper';
import { CategoryMapper } from './mappers/category.mapper';

/**
 * Injection tokens for repository interfaces
 * These allow us to inject domain interfaces while providing concrete implementations
 */
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TaskRepository');
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>('CategoryRepository');

/**
 * Infrastructure Module
 * 
 * Provides:
 * - Storage services and adapters
 * - Repository implementations
 * - Entity/DTO mappers
 * - Dependency injection configuration
 */
@NgModule({
  providers: [
    // Storage Service
    StorageService,
    
    // Mappers
    TaskMapper,
    CategoryMapper,
    
    // Repository Implementations
    TaskRepositoryImpl,
    CategoryRepositoryImpl,
    
    // Domain Interface Providers
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryImpl
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl
    },
    
    // Alternative providers using class tokens (for simpler injection)
    {
      provide: TaskRepository,
      useClass: TaskRepositoryImpl
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl
    }
  ]
})
export class InfrastructureModule {
  
  /**
   * Static method to provide the module with specific configuration
   * if needed in the future for different environments
   */
  static forRoot() {
    return {
      ngModule: InfrastructureModule,
      providers: []
    };
  }
}