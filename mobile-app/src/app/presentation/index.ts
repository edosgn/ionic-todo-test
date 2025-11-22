/**
 * Presentation Layer Exports
 * 
 * This file centralizes all presentation layer exports for easy importing
 * from other parts of the application.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

// Stores
export { TaskStore } from './stores/task.store';
export { CategoryStore } from './stores/category.store';

// Mappers
export { TaskPresentationMapper } from './mappers/task-presentation.mapper';
export { CategoryPresentationMapper } from './mappers/category-presentation.mapper';

// Components
export { TaskListComponent } from './components/task-list/task-list.component';
export { TaskFormComponent } from './components/task-form/task-form.component';

// Pages
export { TasksPage } from './pages/tasks/tasks.page';

// Module
export { PresentationModule } from './presentation.module';