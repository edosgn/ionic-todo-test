import { Routes } from '@angular/router';
import { TaskDataGuard, TaskExistsGuard } from './presentation/guards/task.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./presentation/pages/tasks/tasks.page').then((m) => m.TasksPage),
    canActivate: [TaskDataGuard]
  },
  {
    path: 'task/new',
    loadComponent: () =>
      import('./presentation/components/task-form/task-form.component').then((m) => m.TaskFormComponent),
    canActivate: [TaskDataGuard]
  },
  {
    path: 'task/:id/edit',
    loadComponent: () =>
      import('./presentation/components/task-form/task-form.component').then((m) => m.TaskFormComponent),
    canActivate: [TaskDataGuard, TaskExistsGuard]
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./presentation/pages/categories/categories.page').then((m) => m.CategoriesPage),
  },
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/tasks',
  },
];
