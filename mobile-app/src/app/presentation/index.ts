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

// Services
export { NavigationService } from './services/navigation.service';

// Guards
export { TaskDataGuard, TaskExistsGuard } from './guards/task.guards';

// Mappers
export { TaskPresentationMapper } from './mappers/task-presentation.mapper';
export { CategoryPresentationMapper } from './mappers/category-presentation.mapper';

// Components
export { TaskListComponent } from './components/task-list/task-list.component';
export { TaskFormComponent } from './components/task-form/task-form.component';

// Pages
export { TasksPage } from './pages/tasks/tasks.page';
export { CategoriesPage } from './pages/categories/categories.page';

// Module
export { PresentationModule } from './presentation.module';