/**
 * Color Design Tokens
 * 
 * Defines the color system for the design system including primary, secondary,
 * semantic colors, and neutral scales following Ionic design principles.
 */

export const COLORS = {
  // Primary colors
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Base primary
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Secondary colors
  secondary: {
    50: '#fce4ec',
    100: '#f8bbd9',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63', // Base secondary
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },

  // Semantic colors
  semantic: {
    success: {
      50: '#e8f5e8',
      100: '#c8e6c9',
      500: '#4caf50', // Base success
      600: '#43a047',
      900: '#1b5e20',
    },
    warning: {
      50: '#fff3e0',
      100: '#ffe0b2',
      500: '#ff9800', // Base warning
      600: '#fb8c00',
      900: '#e65100',
    },
    danger: {
      50: '#ffebee',
      100: '#ffcdd2',
      500: '#f44336', // Base danger
      600: '#e53935',
      900: '#b71c1c',
    },
    info: {
      50: '#e1f5fe',
      100: '#b3e5fc',
      500: '#03a9f4', // Base info
      600: '#039be5',
      900: '#01579b',
    },
  },

  // Neutral/Gray scale
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    1000: '#000000',
  },

  // Category colors (predefined for task categories)
  category: {
    red: '#f44336',
    pink: '#e91e63',
    purple: '#9c27b0',
    deepPurple: '#673ab7',
    indigo: '#3f51b5',
    blue: '#2196f3',
    lightBlue: '#03a9f4',
    cyan: '#00bcd4',
    teal: '#009688',
    green: '#4caf50',
    lightGreen: '#8bc34a',
    lime: '#cddc39',
    yellow: '#ffeb3b',
    amber: '#ffc107',
    orange: '#ff9800',
    deepOrange: '#ff5722',
    brown: '#795548',
    gray: '#9e9e9e',
    blueGray: '#607d8b',
    black: '#000000',
  },
} as const;

/**
 * Color utilities and helper functions
 */
export const ColorUtils = {
  /**
   * Get all category colors as an array
   */
  getCategoryColors(): string[] {
    return Object.values(COLORS.category);
  },

  /**
   * Get color with opacity
   */
  withOpacity(color: string, opacity: number): string {
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return `${color}${alpha}`;
    }
    return color;
  },

  /**
   * Validate hex color
   */
  isValidHexColor(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  },

  /**
   * Get contrast color (black or white) for background
   */
  getContrastColor(backgroundColor: string): string {
    if (!this.isValidHexColor(backgroundColor)) {
      return COLORS.neutral[900];
    }

    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? COLORS.neutral[900] : COLORS.neutral[0];
  },
};

// Export types for TypeScript
export type ColorScale = typeof COLORS.primary;
export type CategoryColor = keyof typeof COLORS.category;
export type SemanticColor = keyof typeof COLORS.semantic;