/**
 * ColorSelectorComponent - Color picker for categories
 * 
 * Provides a visual color selection interface with predefined colors
 * and custom color input option.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, colorPalette } from 'ionicons/icons';

export interface ColorOption {
  name: string;
  value: string;
  description?: string;
}

@Component({
  selector: 'app-color-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonText
  ],
  template: `
    <div class="color-selector">
      <ion-text>
        <h4>Choose a color</h4>
      </ion-text>
      
      <!-- Predefined Colors Grid -->
      <ion-grid class="color-grid">
        <ion-row>
          <ion-col 
            size="2" 
            *ngFor="let color of predefinedColors; trackBy: trackByColorValue"
            class="color-col">
            <ion-button
              fill="clear"
              class="color-button"
              [class.selected]="selectedColor() === color.value"
              (click)="selectColor(color.value)"
              [attr.aria-label]="color.name">
              <div 
                class="color-circle"
                [style.background-color]="color.value"
                [attr.title]="color.name">
                <ion-icon 
                  *ngIf="selectedColor() === color.value" 
                  name="checkmark" 
                  class="checkmark-icon">
                </ion-icon>
              </div>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Custom Color Input -->
      <ion-item class="custom-color-item">
        <ion-icon name="color-palette" slot="start"></ion-icon>
        <ion-label position="stacked">Custom Color (Hex)</ion-label>
        <ion-input
          type="text"
          placeholder="#FF5733"
          [value]="customColor()"
          (ionInput)="onCustomColorChange($event)"
          pattern="^#[0-9A-Fa-f]{6}$"
          maxlength="7">
        </ion-input>
      </ion-item>

      <!-- Color Preview -->
      <div class="color-preview" *ngIf="selectedColor()">
        <div 
          class="preview-circle"
          [style.background-color]="selectedColor()">
        </div>
        <ion-text>
          <p>Selected: <strong>{{ selectedColor() }}</strong></p>
        </ion-text>
      </div>
    </div>
  `,
  styles: [`
    .color-selector {
      padding: 16px;
    }

    .color-grid {
      margin: 16px 0;
      padding: 0;
    }

    .color-col {
      padding: 4px;
    }

    .color-button {
      width: 100%;
      height: 40px;
      margin: 0;
      --padding-start: 0;
      --padding-end: 0;
      --border-radius: 50%;
    }

    .color-button.selected {
      --box-shadow: 0 0 0 3px var(--ion-color-primary);
    }

    .color-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-medium-tint);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .color-circle:hover {
      transform: scale(1.1);
      border-color: var(--ion-color-primary);
    }

    .checkmark-icon {
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
    }

    .custom-color-item {
      margin-top: 16px;
      --padding-start: 0;
      --padding-end: 0;
    }

    .color-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    .preview-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-medium);
    }

    .color-preview p {
      margin: 0;
    }
  `]
})
export class ColorSelectorComponent {
  @Input() selectedColor = signal<string>('#4ECDC4');
  @Output() colorSelected = new EventEmitter<string>();

  customColor = signal<string>('');

  predefinedColors: ColorOption[] = [
    { name: 'Coral Red', value: '#FF6B6B' },
    { name: 'Turquoise', value: '#4ECDC4' },
    { name: 'Sky Blue', value: '#45B7D1' },
    { name: 'Mint Green', value: '#96CEB4' },
    { name: 'Vanilla', value: '#FFEAA7' },
    { name: 'Plum', value: '#DDA0DD' },
    { name: 'Aquamarine', value: '#98D8C8' },
    { name: 'Khaki', value: '#F7DC6F' },
    { name: 'Lavender', value: '#BB8FCE' },
    { name: 'Light Blue', value: '#85C1E9' },
    { name: 'Peach', value: '#F8C471' },
    { name: 'Light Green', value: '#82E0AA' },
    { name: 'Light Coral', value: '#F1948A' },
    { name: 'Powder Blue', value: '#AED6F1' },
    { name: 'Light Sea Green', value: '#A9DFBF' },
    { name: 'Orange', value: '#FFA726' },
    { name: 'Purple', value: '#AB47BC' },
    { name: 'Indigo', value: '#5C6BC0' },
    { name: 'Teal', value: '#26A69A' },
    { name: 'Amber', value: '#FFCA28' }
  ];

  constructor() {
    addIcons({ checkmark, colorPalette });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    this.customColor.set('');
    this.colorSelected.emit(color);
  }

  onCustomColorChange(event: any): void {
    const value = event.detail.value;
    this.customColor.set(value);
    
    if (this.isValidHexColor(value)) {
      this.selectedColor.set(value);
      this.colorSelected.emit(value);
    }
  }

  private isValidHexColor(color: string): boolean {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(color);
  }

  trackByColorValue(index: number, color: ColorOption): string {
    return color.value;
  }
}