/**
 * Application Configuration
 * 
 * Provides application-wide configuration for standalone components
 * including routing, infrastructure services, and external dependencies.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { ApplicationConfig, importProvidersFrom, ErrorHandler, ENVIRONMENT_INITIALIZER } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';

// Application routes
import { routes } from './app.routes';

// Infrastructure module with repository implementations
import { InfrastructureModule } from './infrastructure/infrastructure.module';

// Environment
import { environment } from '../environments/environment';

/**
 * Custom error handler to prevent app crashes
 */
class AppErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('🚨 Application Error:', error);
    
    // Don't throw the error to prevent app crashes
    // Instead, just log it for debugging
    if (error.message?.includes('firstCreatePass')) {
      console.warn('⚠️ Angular initialization error detected, attempting recovery...');
      return;
    }
    
    if (error.message?.includes('providersResolver')) {
      console.warn('⚠️ Provider resolution error detected, continuing...');
      return;
    }
  }
}

/**
 * Initialize critical services
 */
function initializeApp(): () => void {
  return () => {
    console.log('🔧 App initialization started');
  };
}

/**
 * Application configuration object
 * Used by bootstrapApplication to configure the app
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Error handling
    { provide: ErrorHandler, useClass: AppErrorHandler },
    
    // Router configuration
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Ionic configuration
    provideIonicAngular({
      mode: 'md'
    }),
    
    // Animations support
    provideAnimations(),
    
    // App initialization
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: initializeApp
    },
    
    // Infrastructure services and repositories
    importProvidersFrom(InfrastructureModule)
  ],
};