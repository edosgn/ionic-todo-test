/**
 * Infrastructure Layer Exports
 * 
 * This file centralizes all infrastructure layer exports for easy importing
 * from other parts of the application. This follows the Barrel Export pattern
 * to provide a clean public API for the infrastructure layer.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

// Storage Adapters
export { StorageService } from './adapters/storage/storage.service';
export * from './adapters/storage/storage.types';

// Repository Implementations
export { TaskRepositoryImpl } from './adapters/repositories/task.repository.impl';
export { CategoryRepositoryImpl } from './adapters/repositories/category.repository.impl';

// Mappers
export { TaskMapper } from './mappers/task.mapper';
export { CategoryMapper } from './mappers/category.mapper';

// Infrastructure Module
export { InfrastructureModule, TASK_REPOSITORY, CATEGORY_REPOSITORY } from './infrastructure.module';