/**
 * StatCardComponent - Statistics card organism using design system
 * 
 * A statistics card component that combines multiple atoms (icon, button)
 * to create a cohesive data visualization element. Part of the design
 * system organism layer.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Design System imports
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconColor, IconSize } from '../../atoms/icon/icon.component';

export interface StatCardData {
  value: string | number;
  label: string;
  icon: string;
  color?: IconColor;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

/**
 * Statistics Card Component
 * 
 * @example
 * ```html
 * <!-- Basic stat card -->
 * <lib-stat-card
 *   [data]="{
 *     value: 42,
 *     label: 'Total Tasks',
 *     icon: 'list-outline',
 *     color: 'primary'
 *   }">
 * </lib-stat-card>
 * 
 * <!-- Stat card with trend -->
 * <lib-stat-card
 *   [data]="{
 *     value: '75%',
 *     label: 'Completion Rate',
 *     icon: 'trending-up',
 *     color: 'success',
 *     trend: 'up',
 *     trendValue: '+5%'
 *   }"
 *   [interactive]="true"
 *   (cardClick)="viewDetails()">
 * </lib-stat-card>
 * ```
 */
@Component({
  selector: 'lib-stat-card',
  standalone: true,
  imports: [CommonModule, IonicModule, IconComponent],
  template: `
    <div 
      class="lib-stat-card"
      [class.lib-stat-card--interactive]="interactive"
      [class.lib-stat-card--loading]="loading"
      [attr.tabindex]="interactive ? 0 : -1"
      [attr.role]="interactive ? 'button' : null"
      [attr.aria-label]="interactive ? (label + ': ' + value) : null"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()">
      
      <!-- Card Content -->
      <div class="lib-stat-card__content">
        <!-- Main Stats -->
        <div class="lib-stat-card__main">
          <div class="lib-stat-card__value">
            {{ value }}
            <span 
              *ngIf="trend && trendValue" 
              class="lib-stat-card__trend"
              [class.lib-stat-card__trend--up]="trend === 'up'"
              [class.lib-stat-card__trend--down]="trend === 'down'">
              {{ trendValue }}
            </span>
          </div>
          <div class="lib-stat-card__label">{{ label }}</div>
        </div>

        <!-- Icon -->
        <div class="lib-stat-card__icon">
          <lib-icon
            [name]="icon"
            [size]="iconSize"
            [color]="color || 'medium'">
          </lib-icon>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div *ngIf="loading" class="lib-stat-card__loading">
        <ion-spinner name="dots"></ion-spinner>
      </div>

      <!-- Color Accent -->
      <div 
        class="lib-stat-card__accent"
        [style.background]="getAccentColor()">
      </div>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input({ required: true }) value!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) icon!: string;
  @Input() color?: IconColor;
  @Input() trend?: 'up' | 'down';
  @Input() trendValue?: string;
  @Input() interactive = false;
  @Input() loading = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'default' | 'minimal' | 'elevated' = 'default';

  // Icon size based on card size
  get iconSize(): IconSize {
    switch (this.size) {
      case 'small': return 'md';
      case 'large': return '2xl';
      default: return 'xl';
    }
  }

  /**
   * Handle card click events
   */
  onCardClick(): void {
    if (this.interactive && !this.loading) {
      // Emit click event - parent can listen with (click)
      // The click event will bubble up naturally
    }
  }

  /**
   * Get accent color based on data color
   */
  getAccentColor(): string {
    const colorMap: Record<IconColor, string> = {
      primary: 'var(--ion-color-primary)',
      secondary: 'var(--ion-color-secondary)',
      success: 'var(--ion-color-success)',
      warning: 'var(--ion-color-warning)',
      danger: 'var(--ion-color-danger)',
      dark: 'var(--ion-color-dark)',
      medium: 'var(--ion-color-medium)',
      light: 'var(--ion-color-light)'
    };

    return colorMap[this.color || 'primary'];
  }
}