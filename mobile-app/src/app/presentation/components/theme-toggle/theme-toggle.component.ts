import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

/**
 * Theme Toggle Component
 * 
 * Provides a button to toggle between light and dark themes.
 * Displays the current theme mode with an appropriate icon.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-button 
      fill="clear" 
      size="default"
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      [attr.aria-label]="'Toggle theme to ' + (isDarkMode() ? 'light' : 'dark') + ' mode'">
      <ion-icon 
        slot="icon-only" 
        size="large"
        [name]="isDarkMode() ? 'sunny' : 'moon'">
      </ion-icon>
    </ion-button>
  `,
  styles: [`
    .theme-toggle-btn {
      --color: var(--ion-toolbar-color) !important;
      --background: transparent;
      --padding-start: 12px;
      --padding-end: 12px;
      --border-radius: 8px;
      margin: 0 4px;
    }
    
    .theme-toggle-btn:hover {
      --background: rgba(var(--ion-toolbar-color-rgb), 0.1) !important;
    }
    
    ion-icon {
      font-size: 22px;
      color: var(--ion-toolbar-color) !important;
    }
    
    :host-context(body.dark) {
      .theme-toggle-btn {
        --color: #ffffff !important;
      }
      
      ion-icon {
        color: #ffffff !important;
      }
      
      .theme-toggle-btn:hover {
        --background: rgba(255, 255, 255, 0.1) !important;
      }
    }
  `]
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  protected isDarkMode = this.themeService.isDarkMode;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
