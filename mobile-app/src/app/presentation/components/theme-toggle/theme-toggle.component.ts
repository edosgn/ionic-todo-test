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
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  protected isDarkMode = this.themeService.isDarkMode;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
