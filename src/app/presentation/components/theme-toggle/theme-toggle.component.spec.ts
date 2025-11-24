import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: jest.Mocked<ThemeService>;
  let isDarkModeSignal: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    isDarkModeSignal = signal(false);

    const themeServiceMock = {
      isDarkMode: jest.fn(() => isDarkModeSignal()),
      toggleTheme: jest.fn(),
      setThemeMode: jest.fn(),
      themeMode: signal('light').asReadonly(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display moon icon in light mode', () => {
    isDarkModeSignal.set(false);
    fixture.detectChanges();
    
    const icon = fixture.nativeElement.querySelector('ion-icon');
    expect(icon).toBeTruthy();
    expect(icon.name).toBe('moon-outline');
  });

  it('should display sun icon in dark mode', () => {
    isDarkModeSignal.set(true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('ion-icon');
    expect(icon).toBeTruthy();
    expect(icon.name).toBe('sunny-outline');
  });

  it('should call toggleTheme when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('ion-button');
    button.click();

    expect(themeService.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    const button = fixture.nativeElement.querySelector('ion-button');
    
    expect(button.hasAttribute('aria-label')).toBe(true);
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
