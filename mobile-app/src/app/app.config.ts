/**
 * Application Configuration
 * 
 * Provides application-wide configuration for standalone components
 * including routing, infrastructure services, and external dependencies.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';

// Application routes
import { routes } from './app.routes';

// Infrastructure module with repository implementations
import { InfrastructureModule } from './infrastructure/infrastructure.module';

/**
 * Application configuration object
 * Used by bootstrapApplication to configure the app
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Ionic configuration
    provideIonicAngular(),
    
    // Animations support
    provideAnimations(),
    
    // Infrastructure services and repositories
    importProvidersFrom(InfrastructureModule)
  ],
};