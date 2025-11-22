/**
 * Badge Component
 * 
 * A versatile badge component for displaying status, counts, or labels
 * using design system tokens and consistent styling.
 */

import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonBadge } from '@ionic/angular/standalone';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Reusable Badge Component
 * 
 * @example
 * ```html
 * <!-- Basic badge -->
 * <lib-badge>New</lib-badge>
 * 
 * <!-- Status badge -->
 * <lib-badge variant="success" size="sm">Active</lib-badge>
 * 
 * <!-- Count badge -->
 * <lib-badge variant="danger" [count]="5"></lib-badge>
 * 
 * <!-- Dot badge -->
 * <lib-badge variant="warning" [dot]="true"></lib-badge>
 * ```
 */
@Component({
  selector: 'lib-badge',
  standalone: true,
  imports: [CommonModule, IonBadge],
  template: `
    <ion-badge 
      [color]="variant"
      [class.lib-badge--dot]="dot"
      [class.lib-badge--pulse]="pulse"
      class="lib-badge"
    >
      <ng-content *ngIf="!dot && !count"></ng-content>
      <span *ngIf="count && !dot" class="lib-badge__count">
        {{ displayCount }}
      </span>
    </ion-badge>
  `,
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  /**
   * Badge visual variant
   */
  @Input() variant: BadgeVariant = 'primary';

  /**
   * Badge size
   */
  @Input() size: BadgeSize = 'md';

  /**
   * Whether to show as a dot badge
   */
  @Input() dot = false;

  /**
   * Count value to display
   */
  @Input() count?: number;

  /**
   * Maximum count to display before showing "99+"
   */
  @Input() maxCount = 99;

  /**
   * Whether to show pulse animation
   */
  @Input() pulse = false;

  /**
   * Whether the badge is inline with text
   */
  @Input() inline = false;

  /**
   * Get display count with max limit
   */
  get displayCount(): string {
    if (this.count === undefined) return '';
    return this.count > this.maxCount ? `${this.maxCount}+` : this.count.toString();
  }

  /**
   * CSS class binding for component state
   */
  @HostBinding('class') get cssClass(): string {
    return [
      'lib-badge-wrapper',
      `lib-badge-wrapper--${this.variant}`,
      `lib-badge-wrapper--${this.size}`,
      this.dot ? 'lib-badge-wrapper--dot' : '',
      this.pulse ? 'lib-badge-wrapper--pulse' : '',
      this.inline ? 'lib-badge-wrapper--inline' : '',
    ].filter(Boolean).join(' ');
  }
}