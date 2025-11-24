/**
 * FilterChipComponent - Organism for category filtering
 * 
 * Interactive chip component that combines design system atoms to create
 * a filtering interface for categories. Features selection states, icons,
 * accessibility, and modern glass-morphism design.
 * 
 * Features:
 * - Selected/unselected states with visual feedback
 * - Icon and text display
 * - Click and keyboard interaction
 * - Accessibility with ARIA attributes
 * - Custom colors and variants
 * - Glass-morphism design with animations
 * - Clear/dismiss functionality
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IconComponent, IconColor } from '../../atoms';

export interface FilterChipData {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  count?: number;
}

@Component({
  selector: 'lib-filter-chip',
  standalone: true,
  imports: [CommonModule, IonicModule, IconComponent],
  template: `
    <div 
      class="lib-filter-chip"
      [class.lib-filter-chip--selected]="selected"
      [class.lib-filter-chip--disabled]="disabled"
      [class.lib-filter-chip--dismissible]="dismissible && selected"
      [class.lib-filter-chip--small]="size === 'small'"
      [class.lib-filter-chip--large]="size === 'large'"
      [style.--chip-color]="chipColor"
      [attr.role]="'button'"
      [attr.tabindex]="disabled ? -1 : 0"
      [attr.aria-label]="ariaLabel"
      [attr.aria-pressed]="selected"
      (click)="onChipClick()"
      (keydown.enter)="onChipClick()"
      (keydown.space)="onChipClick()">
      
      <!-- Chip Content -->
      <div class="lib-filter-chip__content">
        <!-- Icon -->
        <lib-icon 
          *ngIf="data.icon"
          [name]="data.icon"
          [size]="iconSize"
          [color]="iconColor"
          class="lib-filter-chip__icon">
        </lib-icon>

        <!-- Label -->
        <span class="lib-filter-chip__label">
          {{ data.label }}
        </span>

        <!-- Count Badge -->
        <span 
          *ngIf="data.count !== undefined && showCount"
          class="lib-filter-chip__count">
          {{ displayCount }}
        </span>

        <!-- Dismiss Button -->
        <lib-icon 
          *ngIf="dismissible && selected && !disabled"
          name="close"
          size="sm"
          [color]="iconColor"
          class="lib-filter-chip__dismiss"
          [attr.aria-label]="'Remove filter: ' + data.label"
          (click)="onDismissClick($event)">
        </lib-icon>
      </div>

      <!-- Selection Indicator -->
      <div 
        class="lib-filter-chip__indicator"
        [class.lib-filter-chip__indicator--visible]="selected">
      </div>
    </div>
  `,
  styleUrls: ['./filter-chip.component.scss']
})
export class FilterChipComponent {
  // Input Properties
  @Input({ required: true }) data!: FilterChipData;
  @Input() selected = false;
  @Input() disabled = false;
  @Input() dismissible = false;
  @Input() showCount = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'filled' | 'outlined' | 'minimal' = 'filled';
  @Input() maxCount = 99;

  // Output Events
  @Output() chipClick = new EventEmitter<string>();
  @Output() dismissClick = new EventEmitter<string>();

  /**
   * Get chip color CSS variable value
   */
  get chipColor(): string {
    if (this.data.color) {
      // Check if it's a CSS variable
      if (this.data.color.startsWith('--')) {
        return `var(${this.data.color})`;
      }
      // Check if it's an Ionic color
      if (['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'].includes(this.data.color)) {
        return `var(--ion-color-${this.data.color})`;
      }
      // Return as-is for hex/rgb values
      return this.data.color;
    }
    return 'var(--ion-color-primary)';
  }

  /**
   * Get icon color based on selection state
   */
  get iconColor(): IconColor {
    if (this.selected) {
      return this.variant === 'filled' ? 'light' : 'primary';
    }
    return 'medium';
  }

  /**
   * Get icon size based on chip size
   */
  get iconSize(): 'xs' | 'sm' | 'md' | 'lg' {
    switch (this.size) {
      case 'small': return 'xs';
      case 'large': return 'md';
      default: return 'sm';
    }
  }

  /**
   * Get display count with max limit
   */
  get displayCount(): string {
    if (this.data.count === undefined) return '';
    return this.data.count > this.maxCount ? `${this.maxCount}+` : this.data.count.toString();
  }

  /**
   * Get ARIA label for accessibility
   */
  get ariaLabel(): string {
    let label = `Filter by ${this.data.label}`;
    
    if (this.data.count !== undefined) {
      label += ` (${this.displayCount} items)`;
    }
    
    if (this.selected) {
      label += ', currently selected';
    }
    
    return label;
  }

  /**
   * Handle chip click
   */
  onChipClick(): void {
    if (this.disabled) return;
    this.chipClick.emit(this.data.id);
  }

  /**
   * Handle dismiss click
   */
  onDismissClick(event: Event): void {
    event.stopPropagation(); // Prevent chip click
    if (this.disabled) return;
    this.dismissClick.emit(this.data.id);
  }
}