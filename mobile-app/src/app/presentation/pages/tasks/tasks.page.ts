/**
 * TasksPage - Main tasks page with list view
 * 
 * Primary page for task management with list and form integration.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Presentation imports
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, IonicModule, TaskListComponent],
  template: `
    <app-task-list></app-task-list>
  `
})
export class TasksPage {
  constructor() {}
}