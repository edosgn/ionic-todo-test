/**
 * IconSelectorComponent - Icon picker for categories
 * 
 * Provides a visual icon selection interface with commonly used icons
 * for task categorization.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonIcon,
  IonSearchbar,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, folder, briefcase, fitness, restaurant, car, airplane, 
  book, camera, heart, gift, star, trophy, 
  build, medical, school, basketball, football, bicycle, 
  cafe, pizza, wine, wallet, card, cash, 
  laptop, watch, headset, tv,
  checkmarkCircle,
  musicalNote,
  gameController,
  phonePortrait,
  cart
} from 'ionicons/icons';

export interface IconOption {
  name: string;
  value: string;
  category: string;
}

@Component({
  selector: 'app-icon-selector',
  standalone: true,
  imports: [
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonText
  ],
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss']
})
export class IconSelectorComponent {
  @Input() selectedIcon: string = 'folder';
  @Output() iconSelected = new EventEmitter<string>();

  searchText = signal<string>('');
  
  availableIcons: IconOption[] = [
    // General
    { name: 'Home', value: 'home', category: 'general' },
    { name: 'Folder', value: 'folder', category: 'general' },
    { name: 'Briefcase', value: 'briefcase', category: 'general' },
    { name: 'Star', value: 'star', category: 'general' },
    { name: 'Heart', value: 'heart', category: 'general' },
    { name: 'Gift', value: 'gift', category: 'general' },
    { name: 'Trophy', value: 'trophy', category: 'general' },
    { name: 'Build', value: 'build', category: 'general' },
    
    // Health & Fitness
    { name: 'Fitness', value: 'fitness', category: 'health' },
    { name: 'Medical', value: 'medical', category: 'health' },
    { name: 'Basketball', value: 'basketball', category: 'health' },
    { name: 'Football', value: 'football', category: 'health' },
    { name: 'Bicycle', value: 'bicycle', category: 'health' },
    
    // Food & Dining
    { name: 'Restaurant', value: 'restaurant', category: 'food' },
    { name: 'Cafe', value: 'cafe', category: 'food' },
    { name: 'Pizza', value: 'pizza', category: 'food' },
    { name: 'Wine', value: 'wine', category: 'food' },
    
    // Travel & Transportation
    { name: 'Car', value: 'car', category: 'travel' },
    { name: 'Airplane', value: 'airplane', category: 'travel' },
    
    // Education & Work
    { name: 'Book', value: 'book', category: 'education' },
    { name: 'School', value: 'school', category: 'education' },
    
    // Entertainment
    { name: 'Game Controller', value: 'game-controller', category: 'entertainment' },
    { name: 'Music Note', value: 'musical-note', category: 'entertainment' },
    { name: 'Camera', value: 'camera', category: 'entertainment' },
    { name: 'TV', value: 'tv', category: 'entertainment' },
    { name: 'Headset', value: 'headset', category: 'entertainment' },
    
    // Shopping & Finance
    { name: 'Shopping Cart', value: 'cart', category: 'shopping' },
    { name: 'Wallet', value: 'wallet', category: 'shopping' },
    { name: 'Card', value: 'card', category: 'shopping' },
    { name: 'Cash', value: 'cash', category: 'shopping' },
    
    // Technology
    { name: 'Laptop', value: 'laptop', category: 'technology' },
    { name: 'Phone', value: 'phone-portrait', category: 'technology' },
    { name: 'Watch', value: 'watch', category: 'technology' },
  ];

  filteredIcons = signal<IconOption[]>(this.availableIcons);

  constructor() {
    addIcons({ 
      home, folder, briefcase, fitness, restaurant, car, airplane, 
      book, camera, heart, gift, star, trophy, 
      build, medical, school, basketball, football, bicycle, 
      cafe, pizza, wine, wallet, card, cash, 
      laptop, watch, headset, tv, gameController,
      checkmarkCircle,
      musicalNote,
      phonePortrait,
      cart
    });
  }

  selectIcon(iconValue: string): void {
    this.selectedIcon = iconValue;
    this.iconSelected.emit(iconValue);
  }

  onSearchChange(event: any): void {
    const searchTerm = event.detail.value.toLowerCase();
    this.searchText.set(searchTerm);
    
    if (!searchTerm) {
      this.filteredIcons.set(this.availableIcons);
    } else {
      const filtered = this.availableIcons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm) ||
        icon.category.toLowerCase().includes(searchTerm) ||
        icon.value.toLowerCase().includes(searchTerm)
      );
      this.filteredIcons.set(filtered);
    }
  }

  getSelectedIconName(): string {
    const selectedIconData = this.availableIcons.find(icon => icon.value === this.selectedIcon);
    return selectedIconData?.name || this.selectedIcon;
  }

  trackByIconValue(index: number, icon: IconOption): string {
    return icon.value;
  }
}