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
      (click)="toggleTheme()"
      [attr.aria-label]="'Toggle theme to ' + (isDarkMode() ? 'light' : 'dark') + ' mode'">
      <ion-icon 
        slot="icon-only" 
        [name]="isDarkMode() ? 'sunny-outline' : 'moon-outline'"
        [style.color]="'var(--ion-toolbar-color)'">
      </ion-icon>
    </ion-button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    ion-button {
      --padding-start: 8px;
      --padding-end: 8px;
      --color: var(--ion-toolbar-color);
    }
    
    ion-icon {
      font-size: 24px;
      transition: color 0.3s ease;
    }
    
    // Ensure proper contrast in different themes
    :host-context(body.dark) {
      ion-button {
        --color: #ffffff;
      }
      
      ion-icon {
        color: #ffffff !important;
      }
    }
    
    :host-context(body:not(.dark)) {
      ion-button {
        --color: #1a1a1a;
      }
      
      ion-icon {
        color: #1a1a1a !important;
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
