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
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, list, settings } from 'ionicons/icons';

// Presentation imports
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [
    CommonModule, 
    TaskListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class TasksPage {

  constructor(private router: Router) {
    addIcons({ add, list, settings });
  }

  navigateToCategories() {
    this.router.navigate(['/categories']);
  }

  navigateToNewTask() {
    this.router.navigate(['/task/new']);
  }
}