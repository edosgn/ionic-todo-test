/**
 * Button Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, IonButton, IonIcon, IonSpinner]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render content', () => {
    const content = 'Click me';
    fixture.nativeElement.innerHTML = content;
    fixture.detectChanges();
    
    const buttonContent = compiled.querySelector('.ds-button__content');
    expect(buttonContent).toBeTruthy();
  });

  it('should apply correct variant classes', () => {
    component.variant = 'primary';
    fixture.detectChanges();
    
    expect(component.ionColor).toBe('primary');
    expect(component.ionFill).toBe('solid');
  });

  it('should apply outline variant correctly', () => {
    component.variant = 'outline';
    fixture.detectChanges();
    
    expect(component.ionFill).toBe('outline');
  });

  it('should apply ghost variant correctly', () => {
    component.variant = 'ghost';
    fixture.detectChanges();
    
    expect(component.ionFill).toBe('clear');
  });

  it('should handle different sizes', () => {
    component.size = 'small';
    expect(component.ionSize).toBe('small');

    component.size = 'medium';
    expect(component.ionSize).toBe('default');

    component.size = 'large';
    expect(component.ionSize).toBe('large');
  });

  it('should show loading spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = compiled.querySelector('ion-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should hide content when loading and hideContentWhileLoading is true', () => {
    component.loading = true;
    component.hideContentWhileLoading = true;
    fixture.detectChanges();

    const content = compiled.querySelector('.ds-button__content--hidden');
    expect(content).toBeTruthy();
  });

  it('should disable button when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const ionButton = compiled.querySelector('ion-button');
    expect(ionButton?.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should disable button when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const ionButton = compiled.querySelector('ion-button');
    expect(ionButton?.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should show start icon when provided', () => {
    component.startIcon = 'add';
    fixture.detectChanges();

    const startIcon = compiled.querySelector('.ds-button__icon--start');
    expect(startIcon).toBeTruthy();
    expect(startIcon?.getAttribute('ng-reflect-name')).toBe('add');
  });

  it('should show end icon when provided', () => {
    component.endIcon = 'chevron-forward';
    fixture.detectChanges();

    const endIcon = compiled.querySelector('.ds-button__icon--end');
    expect(endIcon).toBeTruthy();
    expect(endIcon?.getAttribute('ng-reflect-name')).toBe('chevron-forward');
  });

  it('should not show icons when loading', () => {
    component.startIcon = 'add';
    component.endIcon = 'chevron-forward';
    component.loading = true;
    fixture.detectChanges();

    const startIcon = compiled.querySelector('.ds-button__icon--start');
    const endIcon = compiled.querySelector('.ds-button__icon--end');
    
    expect(startIcon).toBeFalsy();
    expect(endIcon).toBeFalsy();
  });

  it('should emit buttonClick when clicked', () => {
    spyOn(component.buttonClick, 'emit');
    
    const button = compiled.querySelector('ion-button') as HTMLElement;
    button.click();

    expect(component.buttonClick.emit).toHaveBeenCalled();
  });

  it('should not emit buttonClick when disabled', () => {
    component.disabled = true;
    spyOn(component.buttonClick, 'emit');
    
    const button = compiled.querySelector('ion-button') as HTMLElement;
    button.click();

    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });

  it('should not emit buttonClick when loading', () => {
    component.loading = true;
    spyOn(component.buttonClick, 'emit');
    
    const button = compiled.querySelector('ion-button') as HTMLElement;
    button.click();

    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });

  it('should apply correct CSS classes to host', () => {
    component.variant = 'secondary';
    component.size = 'large';
    component.disabled = true;
    component.loading = true;

    const expectedClasses = [
      'ds-button-wrapper',
      'ds-button-wrapper--secondary',
      'ds-button-wrapper--large',
      'ds-button-wrapper--disabled',
      'ds-button-wrapper--loading'
    ].join(' ');

    expect(component.cssClass).toBe(expectedClasses);
  });
});