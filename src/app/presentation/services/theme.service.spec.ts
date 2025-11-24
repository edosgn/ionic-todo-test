import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        })
      },
      writable: true
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with auto theme by default', () => {
    expect(service.themeMode()).toBe('auto');
  });

  it('should set theme mode', () => {
    service.setThemeMode('dark');
    expect(service.themeMode()).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('app-theme-preference', 'dark');
  });

  it('should toggle between light and dark', () => {
    service.setThemeMode('light');
    service.toggleTheme();
    expect(service.themeMode()).toBe('dark');
    
    service.toggleTheme();
    expect(service.themeMode()).toBe('light');
  });

  it('should check if dark mode is active', () => {
    service.setThemeMode('dark');
    expect(service.isDarkMode()).toBe(true);
    
    service.setThemeMode('light');
    expect(service.isDarkMode()).toBe(false);
  });

  it('should handle auto mode based on system preference', () => {
    // Mock system prefers dark
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    service.setThemeMode('auto');
    expect(service.isDarkMode()).toBe(true);
  });

  it('should persist theme preference', () => {
    service.setThemeMode('dark');
    expect(localStorageMock['app-theme-preference']).toBe('dark');
  });
});
