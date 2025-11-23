import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FeatureFlagStore } from './presentation/stores/feature-flag.store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly featureFlagStore = inject(FeatureFlagStore);

  constructor() {}

  async ngOnInit() {
    // Initialize feature flags from Firebase Remote Config on app startup
    await this.featureFlagStore.initializeFeatureFlags();
    console.log('🚀 Mobile App initialized with feature flags:', this.featureFlagStore.featureFlags());
  }
}
