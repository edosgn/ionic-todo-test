import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { FeatureFlagStore } from './presentation/stores/feature-flag.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly featureFlagStore = inject(FeatureFlagStore);
  private readonly platform = inject(Platform);

  constructor() {}

  async ngOnInit() {
    console.log('🚀 App starting...');
    
    try {
      // Wait for platform to be ready with timeout
      const platformPromise = this.platform.ready();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Platform timeout')), 5000)
      );
      
      await Promise.race([platformPromise, timeoutPromise]);
      console.log('📱 Platform ready');
      
      // Force use default values for now (offline mode)
      this.featureFlagStore.resetToDefaults();
      console.log('✅ Using default feature flags (offline mode)');
      
      // Optional: try to initialize Firebase in background (non-blocking)
      setTimeout(() => {
        this.featureFlagStore.initializeFeatureFlags().catch(error => {
          console.warn('⚠️ Firebase Remote Config unavailable, continuing with defaults:', error);
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Error during app initialization:', error);
      // Even if platform fails, continue with defaults
      this.featureFlagStore.resetToDefaults();
    }
  }
}
