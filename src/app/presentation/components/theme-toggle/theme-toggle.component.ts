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
        [name]="isDarkMode() ? 'sunny-outline' : 'moon-outline'">
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
