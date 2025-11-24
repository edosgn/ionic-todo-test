/**
 * Task Route Guards
 * 
 * Guards for task-related routes to ensure proper data loading and access control.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TaskStore } from '../stores/task.store';
import { CategoryStore } from '../stores/category.store';

/**
 * Guard to ensure categories are loaded before accessing task routes
 */
@Injectable({
  providedIn: 'root'
})
export class TaskDataGuard implements CanActivate {
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);

  canActivate(): boolean {
    // Always allow navigation, load data asynchronously
    // This prevents the app from being stuck on the splash screen
    
    // Load initial data if not already loaded (non-blocking)
    setTimeout(() => {
      if (this.categoryStore.categories().length === 0) {
        this.categoryStore.loadCategories();
      }
      
      if (this.taskStore.tasks().length === 0) {
        this.taskStore.loadTasks();
      }
    }, 0);

    return true;
  }
}

/**
 * Guard to validate task ID for edit routes
 */
@Injectable({
  providedIn: 'root'
})
export class TaskExistsGuard implements CanActivate {
  private readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const taskId = route.paramMap.get('id');
    
    if (!taskId) {
      this.router.navigate(['/tasks']);
      return false;
    }

    // Check if task exists in current state
    const task = this.taskStore.tasks().find(t => t.id === taskId);
    
    if (!task) {
      this.router.navigate(['/tasks']);
      return false;
    }

    return true;
  }
}