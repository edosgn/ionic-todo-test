/**
 * Button Component
 * 
 * A versatile button component that supports different variants, sizes,
 * and states following the design system tokens and Ionic styling.
 */

import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'clear';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonShape = 'round' | 'square' | 'pill';

/**
 * Reusable Button Component
 * 
 * @example
 * ```html
 * <!-- Basic button -->
 * <ds-button>Click me</ds-button>
 * 
 * <!-- Primary button with icon -->
 * <ds-button variant="primary" size="large" startIcon="add">
 *   Add Task
 * </ds-button>
 * 
 * <!-- Loading state -->
 * <ds-button [loading]="isLoading" [disabled]="true">
 *   Save
 * </ds-button>
 * ```
 */
@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonSpinner],
  template: `
    <ion-button
      [color]="ionColor"
      [fill]="ionFill"
      [size]="ionSize"
      [shape]="shape"
      [disabled]="disabled || loading"
      [expand]="expand"
      (click)="handleClick($event)"
      class="ds-button"
      [class.ds-button--loading]="loading"
    >
      <!-- Loading spinner -->
      <ion-spinner 
        *ngIf="loading" 
        name="crescent" 
        class="ds-button__spinner">
      </ion-spinner>

      <!-- Start icon -->
      <ion-icon 
        *ngIf="startIcon && !loading" 
        [name]="startIcon" 
        slot="start"
        class="ds-button__icon ds-button__icon--start">
      </ion-icon>

      <!-- Button content -->
      <span 
        class="ds-button__content"
        [class.ds-button__content--hidden]="loading && hideContentWhileLoading">
        <ng-content></ng-content>
      </span>

      <!-- End icon -->
      <ion-icon 
        *ngIf="endIcon && !loading" 
        [name]="endIcon" 
        slot="end"
        class="ds-button__icon ds-button__icon--end">
      </ion-icon>
    </ion-button>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  /**
   * Button variant that determines the visual style
   */
  @Input() variant: ButtonVariant = 'primary';

  /**
   * Button size
   */
  @Input() size: ButtonSize = 'medium';

  /**
   * Button shape
   */
  @Input() shape: ButtonShape = 'round';

  /**
   * Whether the button is disabled
   */
  @Input() disabled = false;

  /**
   * Whether the button is in loading state
   */
  @Input() loading = false;

  /**
   * Whether to expand the button to full width
   */
  @Input() expand: 'full' | 'block' | undefined = undefined;

  /**
   * Icon name to show at the start of the button
   */
  @Input() startIcon?: string;

  /**
   * Icon name to show at the end of the button
   */
  @Input() endIcon?: string;

  /**
   * Whether to hide content while loading (default: false)
   */
  @Input() hideContentWhileLoading = false;

  /**
   * Button click event
   */
  @Output() buttonClick = new EventEmitter<Event>();

  /**
   * Get Ionic color based on variant
   */
  get ionColor(): string {
    switch (this.variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  }

  /**
   * Get Ionic fill based on variant
   */
  get ionFill(): 'solid' | 'outline' | 'clear' {
    switch (this.variant) {
      case 'outline':
        return 'outline';
      case 'ghost':
      case 'clear':
        return 'clear';
      default:
        return 'solid';
    }
  }

  /**
   * Get Ionic size
   */
  get ionSize(): 'small' | 'default' | 'large' {
    switch (this.size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'default';
    }
  }

  /**
   * CSS class binding for component state
   */
  @HostBinding('class') get cssClass(): string {
    return [
      'ds-button-wrapper',
      `ds-button-wrapper--${this.variant}`,
      `ds-button-wrapper--${this.size}`,
      this.disabled ? 'ds-button-wrapper--disabled' : '',
      this.loading ? 'ds-button-wrapper--loading' : ''
    ].filter(Boolean).join(' ');
  }

  /**
   * Handle button click
   */
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}