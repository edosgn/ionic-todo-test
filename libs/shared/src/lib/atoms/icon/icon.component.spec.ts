/**
 * Icon Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';
import { IonIcon } from '@ionic/angular/standalone';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent, IonIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.name = 'home'; // Set required property
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ion-icon with correct name', () => {
    const ionIcon = compiled.querySelector('ion-icon');
    expect(ionIcon).toBeTruthy();
    expect(ionIcon?.getAttribute('ng-reflect-name')).toBe('home');
  });

  it('should apply custom size when provided', () => {
    component.customSize = '48px';
    fixture.detectChanges();

    expect(component.computedSize).toBe('48px');
  });

  it('should use default size mapping when custom size not provided', () => {
    component.size = 'lg';
    fixture.detectChanges();

    expect(component.computedSize).toBe('24px');
  });

  it('should apply different size classes', () => {
    component.size = 'xl';
    fixture.detectChanges();

    expect(component.cssClass).toContain('lib-icon-wrapper--xl');
  });

  it('should apply clickable class when clickable is true', () => {
    component.clickable = true;
    fixture.detectChanges();

    expect(component.cssClass).toContain('lib-icon-wrapper--clickable');
  });

  it('should apply flip horizontal transform', () => {
    component.flipHorizontal = true;
    fixture.detectChanges();

    expect(component.transform).toContain('scaleX(-1)');
    expect(component.cssClass).toContain('lib-icon-wrapper--flip-h');
  });

  it('should apply flip vertical transform', () => {
    component.flipVertical = true;
    fixture.detectChanges();

    expect(component.transform).toContain('scaleY(-1)');
    expect(component.cssClass).toContain('lib-icon-wrapper--flip-v');
  });

  it('should apply rotation transform', () => {
    component.rotate = 45;
    fixture.detectChanges();

    expect(component.transform).toContain('rotate(45deg)');
    expect(component.cssClass).toContain('lib-icon-wrapper--rotated');
  });

  it('should combine multiple transforms', () => {
    component.flipHorizontal = true;
    component.rotate = 90;
    fixture.detectChanges();

    const transform = component.transform;
    expect(transform).toContain('scaleX(-1)');
    expect(transform).toContain('rotate(90deg)');
  });

  it('should set src attribute when provided', () => {
    component.src = 'custom-icon.svg';
    fixture.detectChanges();

    const ionIcon = compiled.querySelector('ion-icon');
    expect(ionIcon?.getAttribute('ng-reflect-src')).toBe('custom-icon.svg');
  });

  it('should set color attribute when provided', () => {
    component.color = 'primary';
    fixture.detectChanges();

    const ionIcon = compiled.querySelector('ion-icon');
    expect(ionIcon?.getAttribute('ng-reflect-color')).toBe('primary');
  });

  it('should handle all size variants correctly', () => {
    const sizeTests = [
      { size: 'xs' as const, expected: '12px' },
      { size: 'sm' as const, expected: '16px' },
      { size: 'md' as const, expected: '20px' },
      { size: 'lg' as const, expected: '24px' },
      { size: 'xl' as const, expected: '32px' },
      { size: '2xl' as const, expected: '40px' },
    ];

    sizeTests.forEach(({ size, expected }) => {
      component.size = size;
      expect(component.computedSize).toBe(expected);
    });
  });
});