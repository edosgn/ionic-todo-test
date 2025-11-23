import { Component, inject, OnInit, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagDemoComponent } from './presentation/components/feature-flag-demo/feature-flag-demo.component';
import { ThemeToggleComponent } from './presentation/components/theme-toggle/theme-toggle.component';
import { FeatureFlagStore } from './presentation/stores/feature-flag.store';
import { ThemeService } from './presentation/services/theme.service';

@Component({
  imports: [RouterModule, IonicModule, FeatureFlagDemoComponent, ThemeToggleComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly featureFlagStore = inject(FeatureFlagStore);
  private readonly themeService = inject(ThemeService);
  
  protected title = this.featureFlagStore.appTitle;

  constructor() {
    // Initialize theme on app start (loads from localStorage if available)
    // Theme will be applied automatically via effect in ThemeService
    
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
