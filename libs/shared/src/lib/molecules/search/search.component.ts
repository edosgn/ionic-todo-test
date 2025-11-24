/**
 * SearchComponent - Search molecule using design system atoms
 * 
 * A search input component that combines FormField atom with search-specific
 * styling and behavior. Part of the design system molecule layer.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircle } from 'ionicons/icons';

// Design System imports
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [CommonModule, IonicModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true
    }
  ],
  template: `
    <div class="lib-search" [class.lib-search--focused]="isFocused">
      <div class="lib-search__container">
        <lib-icon
          name="search-outline"
          size="md"
          color="medium"
          class="lib-search__icon">
        </lib-icon>
        
        <input
          #searchInput
          type="text"
          class="lib-search__input"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.enter)="onEnter()"
          (keydown.escape)="onEscape()">
        
        <button
          *ngIf="value && clearable"
          type="button"
          class="lib-search__clear"
          (click)="onClear()"
          [disabled]="disabled">
          <lib-icon
            name="close-circle"
            size="sm"
            color="medium">
          </lib-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements ControlValueAccessor {
  @Input() placeholder = 'Search...';
  @Input() disabled = false;
  @Input() clearable = true;
  @Input() debounceTime = 300;
  @Input() value = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() enter = new EventEmitter<string>();

  // Component state
  isFocused = false;
  private debounceTimer?: number;

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => { 
    // Implemented by Angular forms 
  };
  private onTouch: () => void = () => { 
    // Implemented by Angular forms 
  };

  constructor() {
    // Register required icons
    addIcons({
      searchOutline,
      closeCircle
    });
  }

  /**
   * Handle input events with debouncing
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);

    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer for debounced search
    this.debounceTimer = window.setTimeout(() => {
      this.searchChange.emit(this.value);
    }, this.debounceTime);
  }

  /**
   * Handle focus events
   */
  onFocus(): void {
    this.isFocused = true;
    this.onTouch();
  }

  /**
   * Handle blur events
   */
  onBlur(): void {
    this.isFocused = false;
  }

  /**
   * Handle clear action
   */
  onClear(): void {
    this.value = '';
    this.onChange(this.value);
    this.searchChange.emit(this.value);
    this.clear.emit();
    
    // Clear debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  /**
   * Handle enter key press
   */
  onEnter(): void {
    this.enter.emit(this.value);
    
    // Trigger immediate search on enter
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.searchChange.emit(this.value);
  }

  /**
   * Handle escape key press
   */
  onEscape(): void {
    if (this.value) {
      this.onClear();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}