import { Component, inject, OnInit, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagDemoComponent } from './presentation/components/feature-flag-demo/feature-flag-demo.component';
import { FeatureFlagStore } from './presentation/stores/feature-flag.store';

@Component({
  imports: [RouterModule, IonicModule, FeatureFlagDemoComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly featureFlagStore = inject(FeatureFlagStore);
  
  protected title = this.featureFlagStore.appTitle;

  constructor() {
    // Initialize feature flags on app start
    effect(() => {
      const appTitle = this.featureFlagStore.appTitle();
      console.log('App title updated from Firebase:', appTitle);
    });
  }

  async ngOnInit() {
    // Initialize feature flags from Firebase Remote Config
    await this.featureFlagStore.initializeFeatureFlags();
  }
}
