/**
 * Navigation Service
 * 
 * Centralized service for application navigation.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  /**
   * Navigate to tasks page (main page)
   */
  goToTasks() {
    this.router.navigate(['/tasks'], { replaceUrl: true });
  }

  /**
   * Navigate to create new task
   */
  goToNewTask() {
    this.router.navigate(['/task/new']);
  }

  /**
   * Navigate to edit existing task
   */
  goToEditTask(taskId: string) {
    this.router.navigate([`/task/${taskId}/edit`]);
  }

  /**
   * Navigate to categories management
   */
  goToCategories() {
    this.router.navigate(['/categories']);
  }

  /**
   * Go back to previous page or tasks if no history
   */
  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goToTasks();
    }
  }

  /**
   * Navigate to specific route
   */
  navigateTo(route: string, replaceUrl = false) {
    this.router.navigate([route], { replaceUrl });
  }
}