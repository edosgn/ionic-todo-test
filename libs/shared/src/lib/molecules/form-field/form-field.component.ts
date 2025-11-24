/**
 * FormField Component
 * 
 * A molecule component that combines multiple atoms to create a complete
 * form field with label, input/textarea, validation, and helper text.
 */

import { Component, Input, forwardRef, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { IonItem, IonLabel, IonInput, IonTextarea, IonNote } from '@ionic/angular/standalone';

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
export type FormFieldSize = 'small' | 'medium' | 'large';

/**
 * Reusable FormField Molecule
 * 
 * Combines atoms to create a complete form field experience with validation,
 * accessibility features, and consistent styling.
 * 
 * @example
 * ```html
 * <!-- Basic text field -->
 * <lib-form-field
 *   label="Task Title"
 *   [required]="true"
 *   [(ngModel)]="taskTitle">
 * </lib-form-field>
 * 
 * <!-- Textarea field with validation -->
 * <lib-form-field
 *   label="Description"
 *   type="textarea"
 *   [control]="descriptionControl"
 *   helperText="Optional task description"
 *   [maxLength]="500">
 * </lib-form-field>
 * 
 * <!-- Email field with custom validation -->
 * <lib-form-field
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   [required]="true"
 *   [invalid]="emailControl.invalid && emailControl.touched"
 *   errorText="Please enter a valid email address">
 * </lib-form-field>
 * ```
 */
@Component({
  selector: 'lib-form-field',
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonInput, IonTextarea, IonNote],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <ion-item 
      class="lib-form-field"
      [class.lib-form-field--error]="showError"
      [class.lib-form-field--focused]="isFocused()"
      [class.lib-form-field--disabled]="disabled">
      
      <!-- Label -->
      <ion-label 
        [position]="labelPosition"
        [class.lib-form-field__label--required]="required">
        {{ label }}
        <span *ngIf="required" class="lib-form-field__required">*</span>
      </ion-label>

      <!-- Input Field -->
      <ion-input
        *ngIf="type !== 'textarea'"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [maxlength]="maxLength"
        [min]="min"
        [max]="max"
        [step]="step"
        [clearInput]="clearable"
        [value]="value"
        (ionInput)="onInput($event)"
        (ionFocus)="onFocus()"
        (ionBlur)="onBlur()"
        [class.ion-invalid]="showError">
      </ion-input>

      <!-- Textarea Field -->
      <ion-textarea
        *ngIf="type === 'textarea'"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [maxlength]="maxLength"
        [rows]="textareaRows"
        [autoGrow]="autoGrow"
        [value]="value"
        (ionInput)="onInput($event)"
        (ionFocus)="onFocus()"
        (ionBlur)="onBlur()"
        [class.ion-invalid]="showError">
      </ion-textarea>
    </ion-item>

    <!-- Helper Text -->
    <ion-note 
      *ngIf="helperText && !showError"
      class="lib-form-field__helper">
      {{ helperText }}
    </ion-note>

    <!-- Error Message -->
    <ion-note 
      *ngIf="showError"
      slot="error"
      class="lib-form-field__error">
      {{ errorText || getValidationMessage() }}
    </ion-note>

    <!-- Character Count -->
    <ion-note 
      *ngIf="maxLength && showCharacterCount"
      class="lib-form-field__count">
      {{ getValueLength() }}/{{ maxLength }}
    </ion-note>
  `,
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent implements ControlValueAccessor {
  /**
   * Field label
   */
  @Input({ required: true }) label!: string;

  /**
   * Input type
   */
  @Input() type: FormFieldType = 'text';

  /**
   * Field size
   */
  @Input() size: FormFieldSize = 'medium';

  /**
   * Placeholder text
   */
  @Input() placeholder?: string;

  /**
   * Whether field is required
   */
  @Input() required = false;

  /**
   * Whether field is disabled
   */
  @Input() disabled = false;

  /**
   * Whether field is readonly
   */
  @Input() readonly = false;

  /**
   * Whether to show clear button
   */
  @Input() clearable = false;

  /**
   * Maximum input length
   */
  @Input() maxLength?: number;

  /**
   * Show character count
   */
  @Input() showCharacterCount = false;

  /**
   * Helper text
   */
  @Input() helperText?: string;

  /**
   * Custom error text
   */
  @Input() errorText?: string;

  /**
   * Whether field is invalid
   */
  @Input() invalid = false;

  /**
   * Form control for validation
   */
  @Input() control?: FormControl;

  /**
   * Label position
   */
  @Input() labelPosition: 'fixed' | 'stacked' | 'floating' = 'stacked';

  /**
   * Number input min value
   */
  @Input() min?: number;

  /**
   * Number input max value
   */
  @Input() max?: number;

  /**
   * Number input step
   */
  @Input() step?: number;

  /**
   * Textarea rows
   */
  @Input() textareaRows = 3;

  /**
   * Auto-grow textarea
   */
  @Input() autoGrow = true;

  // Component state
  readonly isFocused = signal(false);
  protected value: string | number = '';

  // Get value length for character count
  protected getValueLength(): number {
    return String(this.value || '').length;
  }

  // ControlValueAccessor implementation
  private onChange: (value: string | number) => void = () => { 
    // Implemented by Angular forms 
  };
  private onTouch: () => void = () => { 
    // Implemented by Angular forms 
  };

  /**
   * Get computed error state
   */
  get showError(): boolean {
    if (this.control) {
      return !!(this.control.invalid && this.control.touched);
    }
    return this.invalid;
  }

  /**
   * Handle input change
   */
  onInput(event: CustomEvent): void {
    this.value = event.detail.value;
    this.onChange(this.value);
  }

  /**
   * Handle focus
   */
  onFocus(): void {
    this.isFocused.set(true);
  }

  /**
   * Handle blur
   */
  onBlur(): void {
    this.isFocused.set(false);
    this.onTouch();
  }

  /**
   * Get validation message from form control
   */
  getValidationMessage(): string {
    if (!this.control?.errors) return '';

    const errors = this.control.errors;
    
    if (errors['required']) {
      return `${this.label} is required`;
    }
    if (errors['minlength']) {
      return `${this.label} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.label} must not exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['pattern']) {
      return `${this.label} format is invalid`;
    }
    if (errors['min']) {
      return `${this.label} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.label} must not exceed ${errors['max'].max}`;
    }

    return 'Invalid input';
  }

  // ControlValueAccessor methods
  writeValue(value: string | number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}