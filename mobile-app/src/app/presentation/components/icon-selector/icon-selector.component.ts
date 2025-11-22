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
  template: `
    <div class="icon-selector">
      <ion-text>
        <h4>Choose an icon</h4>
      </ion-text>
      
      <!-- Search Bar -->
      <ion-searchbar
        placeholder="Search icons..."
        [debounce]="300"
        (ionInput)="onSearchChange($event)"
        class="icon-search">
      </ion-searchbar>

      <!-- Icons Grid -->
      <ion-grid class="icons-grid">
        <ion-row>
          <ion-col 
            size="2" 
            *ngFor="let icon of filteredIcons(); trackBy: trackByIconValue"
            class="icon-col">
            <ion-button
              fill="clear"
              class="icon-button"
              [class.selected]="selectedIcon() === icon.value"
              (click)="selectIcon(icon.value)"
              [attr.aria-label]="icon.name">
              <ion-icon 
                [name]="icon.value" 
                class="icon-display"
                [class.selected-icon]="selectedIcon() === icon.value">
              </ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- No Results -->
      <div *ngIf="filteredIcons().length === 0" class="no-results">
        <ion-text color="medium">
          <p>No icons found</p>
          <small>Try a different search term</small>
        </ion-text>
      </div>

      <!-- Selected Icon Preview -->
      <div class="icon-preview" *ngIf="selectedIcon()">
        <ion-icon [name]="selectedIcon()" class="preview-icon"></ion-icon>
        <ion-text>
          <p>Selected: <strong>{{ getSelectedIconName() }}</strong></p>
        </ion-text>
      </div>
    </div>
  `,
  styles: [`
    .icon-selector {
      padding: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .icon-search {
      margin: 8px 0;
      --padding-start: 0;
      --padding-end: 0;
    }

    .icons-grid {
      margin: 16px 0;
      padding: 0;
    }

    .icon-col {
      padding: 2px;
    }

    .icon-button {
      width: 100%;
      height: 40px;
      margin: 0;
      --padding-start: 0;
      --padding-end: 0;
      --border-radius: 8px;
      --background: transparent;
    }

    .icon-button.selected {
      --background: var(--ion-color-primary);
      --color: var(--ion-color-primary-contrast);
    }

    .icon-button:hover {
      --background: var(--ion-color-light);
    }

    .icon-display {
      font-size: 18px;
      transition: all 0.2s ease;
    }

    .icon-display.selected-icon {
      color: var(--ion-color-primary-contrast);
    }

    .no-results {
      text-align: center;
      padding: 20px;
    }

    .no-results p {
      margin: 0 0 4px 0;
    }

    .no-results small {
      opacity: 0.7;
    }

    .icon-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px;
      background: var(--ion-color-light);
      border-radius: 8px;
      border-top: 1px solid var(--ion-color-medium);
    }

    .preview-icon {
      font-size: 24px;
      color: var(--ion-color-primary);
    }

    .icon-preview p {
      margin: 0;
    }
  `]
})
export class IconSelectorComponent {
  @Input() selectedIcon = signal<string>('folder');
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
    this.selectedIcon.set(iconValue);
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
    const selectedIconData = this.availableIcons.find(icon => icon.value === this.selectedIcon());
    return selectedIconData?.name || this.selectedIcon();
  }

  trackByIconValue(index: number, icon: IconOption): string {
    return icon.value;
  }
}