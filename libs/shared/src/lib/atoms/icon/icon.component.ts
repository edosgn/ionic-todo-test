/**
 * Icon Component
 * 
 * A reusable icon component that wraps Ionic icons with design system tokens
 * and provides consistent sizing, coloring, and interaction states.
 */

import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light';

/**
 * Reusable Icon Component
 * 
 * @example
 * ```html
 * <!-- Basic icon -->
 * <lib-icon name="home"></lib-icon>
 * 
 * <!-- Icon with size and color -->
 * <lib-icon name="add" size="lg" color="primary"></lib-icon>
 * 
 * <!-- Custom size -->
 * <lib-icon name="star" customSize="32px"></lib-icon>
 * 
 * <!-- Clickable icon -->
 * <lib-icon name="edit" [clickable]="true" (click)="editItem()"></lib-icon>
 * ```
 */
@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <ion-icon
      [name]="name"
      [src]="src"
      [color]="color"
      [class.lib-icon--clickable]="clickable"
      [style.font-size]="computedSize"
    ></ion-icon>
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  /**
   * Icon name from Ionicons
   */
  @Input({ required: true }) name!: string;

  /**
   * Custom icon source URL (alternative to name)
   */
  @Input() src?: string;

  /**
   * Icon size using design tokens
   */
  @Input() size: IconSize = 'md';

  /**
   * Custom size value (overrides size)
   */
  @Input() customSize?: string;

  /**
   * Icon color
   */
  @Input() color?: IconColor;

  /**
   * Whether the icon is clickable (adds hover effects)
   */
  @Input() clickable = false;

  /**
   * Whether to flip the icon horizontally
   */
  @Input() flipHorizontal = false;

  /**
   * Whether to flip the icon vertically
   */
  @Input() flipVertical = false;

  /**
   * Rotation angle in degrees
   */
  @Input() rotate?: number;

  /**
   * Computed size based on size prop or custom size
   */
  get computedSize(): string {
    if (this.customSize) {
      return this.customSize;
    }

    const sizeMap: Record<IconSize, string> = {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
      '2xl': '40px',
    };

    return sizeMap[this.size];
  }

  /**
   * CSS class binding for component state
   */
  @HostBinding('class') get cssClass(): string {
    return [
      'lib-icon-wrapper',
      `lib-icon-wrapper--${this.size}`,
      this.clickable ? 'lib-icon-wrapper--clickable' : '',
      this.flipHorizontal ? 'lib-icon-wrapper--flip-h' : '',
      this.flipVertical ? 'lib-icon-wrapper--flip-v' : '',
      this.rotate ? 'lib-icon-wrapper--rotated' : '',
    ].filter(Boolean).join(' ');
  }

  /**
   * CSS style binding for transformations
   */
  @HostBinding('style.transform') get transform(): string {
    const transforms: string[] = [];

    if (this.flipHorizontal) {
      transforms.push('scaleX(-1)');
    }

    if (this.flipVertical) {
      transforms.push('scaleY(-1)');
    }

    if (this.rotate) {
      transforms.push(`rotate(${this.rotate}deg)`);
    }

    return transforms.length > 0 ? transforms.join(' ') : '';
  }
}