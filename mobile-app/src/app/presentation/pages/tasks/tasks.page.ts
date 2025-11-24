/**
 * TasksPage - Main tasks page with list view
 * 
 * Primary page for task management with list and form integration.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, inject } from '@angular/core';
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
import { add, list, settings, moonOutline, sunnyOutline, moon, sunny } from 'ionicons/icons';

// Presentation imports
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { FeatureFlagStore } from '../../stores/feature-flag.store';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [
    CommonModule, 
    TaskListComponent,
    ThemeToggleComponent,
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

  protected featureFlagStore = inject(FeatureFlagStore);

  constructor(private router: Router) {
    addIcons({ add, list, settings, moonOutline, sunnyOutline, moon, sunny });
  }

  navigateToCategories() {
    this.router.navigate(['/categories']);
  }

  navigateToNewTask() {
    this.router.navigate(['/task/new']);
  }
}