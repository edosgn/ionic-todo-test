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
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent {
  @Input() selectedColor: string = '#4ECDC4';
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
    this.selectedColor = color;
    this.customColor.set('');
    this.colorSelected.emit(color);
  }

  onCustomColorChange(event: any): void {
    const value = event.detail.value;
    this.customColor.set(value);
    
    if (this.isValidHexColor(value)) {
      this.selectedColor = value;
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