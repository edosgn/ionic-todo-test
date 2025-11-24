import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagStore } from '../../stores/feature-flag.store';

/**
 * FeatureFlagDemoComponent
 * 
 * Demo component to showcase how Firebase Remote Config feature flags work.
 * This component displays the current state of all feature flags and provides
 * controls to refresh them from Firebase.
 * 
 * Architecture Layer: Presentation
 * Purpose: Demo and testing of feature flags functionality
 */
@Component({
  selector: 'app-feature-flag-demo',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>
          <!-- Dynamic title from Remote Config -->
          {{ featureFlagStore.appTitle() }}
        </ion-card-title>
        <ion-card-subtitle>
          Feature Flags Demo - Firebase Remote Config
        </ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <!-- Loading State -->
        <div *ngIf="featureFlagStore.loading()" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading feature flags...</p>
        </div>

        <!-- Error State -->
        <ion-item *ngIf="featureFlagStore.error() as error" color="danger">
          <ion-icon name="warning" slot="start"></ion-icon>
          <ion-label>
            <h3>Error loading feature flags</h3>
            <p>{{ error }}</p>
          </ion-label>
        </ion-item>

        <!-- Feature Flags Display -->
        <div *ngIf="!featureFlagStore.loading()" class="feature-flags">
          
          <!-- Categories Feature -->
          <ion-item>
            <ion-icon 
              [name]="featureFlagStore.categoriesEnabled() ? 'checkmark-circle' : 'close-circle'" 
              [color]="featureFlagStore.categoriesEnabled() ? 'success' : 'danger'"
              slot="start">
            </ion-icon>
            <ion-label>
              <h3>Categories Feature</h3>
              <p>{{ featureFlagStore.categoriesEnabled() ? 'Enabled' : 'Disabled' }}</p>
            </ion-label>
            <ion-badge 
              slot="end" 
              [color]="featureFlagStore.categoriesEnabled() ? 'success' : 'danger'">
              {{ featureFlagStore.categoriesEnabled() }}
            </ion-badge>
          </ion-item>

          <!-- Delete Task Feature -->
          <ion-item>
            <ion-icon 
              [name]="featureFlagStore.deleteTaskEnabled() ? 'checkmark-circle' : 'close-circle'" 
              [color]="featureFlagStore.deleteTaskEnabled() ? 'success' : 'danger'"
              slot="start">
            </ion-icon>
            <ion-label>
              <h3>Delete Task Feature</h3>
              <p>{{ featureFlagStore.deleteTaskEnabled() ? 'Enabled' : 'Disabled' }}</p>
            </ion-label>
            <ion-badge 
              slot="end" 
              [color]="featureFlagStore.deleteTaskEnabled() ? 'success' : 'danger'">
              {{ featureFlagStore.deleteTaskEnabled() }}
            </ion-badge>
          </ion-item>

          <!-- Max Tasks Limit -->
          <ion-item>
            <ion-icon name="bar-chart" color="primary" slot="start"></ion-icon>
            <ion-label>
              <h3>Max Tasks Limit</h3>
              <p>Current limit from Remote Config</p>
            </ion-label>
            <ion-badge slot="end" color="primary">
              {{ featureFlagStore.maxTasksLimit() }}
            </ion-badge>
          </ion-item>

          <!-- Remote Title -->
          <ion-item>
            <ion-icon name="text" color="secondary" slot="start"></ion-icon>
            <ion-label>
              <h3>Remote Title</h3>
              <p>Title text from Remote Config</p>
            </ion-label>
            <ion-badge slot="end" color="secondary">
              {{ featureFlagStore.appTitle() }}
            </ion-badge>
          </ion-item>

        </div>

        <!-- Demo Actions -->
        <div class="demo-actions" *ngIf="!featureFlagStore.loading()">
          
          <!-- Conditional Categories Section -->
          <div *ngIf="featureFlagStore.shouldShowCategories()" class="category-demo">
            <h4>📁 Categories Section (Enabled)</h4>
            <ion-button expand="block" fill="outline" color="success">
              <ion-icon name="add" slot="start"></ion-icon>
              Add Category
            </ion-button>
          </div>

          <div *ngIf="!featureFlagStore.shouldShowCategories()" class="category-demo">
            <h4>📁 Categories Section (Disabled)</h4>
            <p><em>This section is hidden when categories are disabled via Remote Config</em></p>
          </div>

          <!-- Conditional Delete Button -->
          <div class="delete-demo">
            <h4>🗑️ Delete Actions</h4>
            <ion-button 
              *ngIf="featureFlagStore.shouldShowDeleteButton()"
              expand="block" 
              fill="outline" 
              color="danger">
              <ion-icon name="trash" slot="start"></ion-icon>
              Delete Task (Enabled)
            </ion-button>
            <p *ngIf="!featureFlagStore.shouldShowDeleteButton()">
              <em>Delete buttons are hidden when delete feature is disabled via Remote Config</em>
            </p>
          </div>

        </div>

        <!-- Refresh Button -->
        <ion-button 
          expand="block" 
          (click)="refreshFlags()"
          [disabled]="featureFlagStore.loading()">
          <ion-icon name="refresh" slot="start"></ion-icon>
          Refresh from Firebase
        </ion-button>

        <!-- Debug Info -->
        <details class="debug-info">
          <summary>🔧 Debug Information</summary>
          <pre>{{ debugInfo | json }}</pre>
        </details>

      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      text-align: center;
    }

    .feature-flags {
      margin: 16px 0;
    }

    .demo-actions {
      margin-top: 24px;
    }

    .category-demo, .delete-demo {
      margin: 16px 0;
      padding: 12px;
      border-radius: 8px;
      background-color: var(--ion-color-light);
    }

    .category-demo h4, .delete-demo h4 {
      margin: 0 0 12px 0;
      color: var(--ion-color-dark);
    }

    .debug-info {
      margin-top: 20px;
      padding: 12px;
      background-color: var(--ion-color-light);
      border-radius: 8px;
    }

    .debug-info summary {
      cursor: pointer;
      font-weight: bold;
      color: var(--ion-color-primary);
    }

    .debug-info pre {
      margin-top: 8px;
      font-size: 12px;
      color: var(--ion-color-dark);
      white-space: pre-wrap;
    }
  `]
})
export class FeatureFlagDemoComponent implements OnInit {
  readonly featureFlagStore = inject(FeatureFlagStore);
  debugInfo: { flags: unknown; remoteValues: unknown } = { flags: {}, remoteValues: {} };

  async ngOnInit() {
    console.log('🚀 FeatureFlagDemoComponent initialized');
    
    // Initialize feature flags when component loads
    await this.featureFlagStore.initializeFeatureFlags();
    
    // Update debug info
    this.updateDebugInfo();
  }

  /**
   * Refresh feature flags from Firebase Remote Config
   */
  async refreshFlags() {
    console.log('🔄 Manual refresh triggered');
    await this.featureFlagStore.refreshFeatureFlags();
    this.updateDebugInfo();
  }

  /**
   * Update debug information for display
   */
  private updateDebugInfo() {
    this.debugInfo = this.featureFlagStore.getDebugInfo();
  }
}