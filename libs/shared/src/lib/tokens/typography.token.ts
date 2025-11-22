/**
 * Typography Design Tokens
 * 
 * Defines the typography system including font families, sizes, weights,
 * line heights, and text styles for the design system.
 */

export const TYPOGRAPHY = {
  // Font families
  fontFamilies: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },

  // Font sizes (rem values)
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // Font weights
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * Predefined text styles for common use cases
 */
export const TEXT_STYLES = {
  // Headings
  h1: {
    fontSize: TYPOGRAPHY.fontSizes['4xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    lineHeight: TYPOGRAPHY.lineHeights.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSizes['3xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    lineHeight: TYPOGRAPHY.lineHeights.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    lineHeight: TYPOGRAPHY.lineHeights.snug,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h4: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.snug,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h5: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h6: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  body: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },

  // Labels and captions
  label: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },

  // Interactive elements
  button: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.none,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.none,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  buttonLarge: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    lineHeight: TYPOGRAPHY.lineHeights.none,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },

  // Code and monospace
  code: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontFamily: TYPOGRAPHY.fontFamilies.mono.join(', '),
  },
  codeBlock: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    lineHeight: TYPOGRAPHY.lineHeights.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontFamily: TYPOGRAPHY.fontFamilies.mono.join(', '),
  },
} as const;

/**
 * Typography utilities
 */
export const TypographyUtils = {
  /**
   * Get font family as CSS string
   */
  getFontFamily(family: keyof typeof TYPOGRAPHY.fontFamilies): string {
    return TYPOGRAPHY.fontFamilies[family].join(', ');
  },

  /**
   * Convert rem to pixels (assuming 16px base)
   */
  remToPx(remValue: string): number {
    return parseFloat(remValue.replace('rem', '')) * 16;
  },

  /**
   * Convert pixels to rem (assuming 16px base)
   */
  pxToRem(pxValue: number): string {
    return `${pxValue / 16}rem`;
  },

  /**
   * Get responsive font size for different screen sizes
   */
  getResponsiveFontSize(base: string, scale = 0.875): {
    mobile: string;
    desktop: string;
  } {
    const baseValue = parseFloat(base.replace('rem', ''));
    const mobileValue = baseValue * scale;
    
    return {
      mobile: `${mobileValue}rem`,
      desktop: base,
    };
  },
};

// Export types
export type FontSize = keyof typeof TYPOGRAPHY.fontSizes;
export type FontWeight = keyof typeof TYPOGRAPHY.fontWeights;
export type LineHeight = keyof typeof TYPOGRAPHY.lineHeights;
export type LetterSpacing = keyof typeof TYPOGRAPHY.letterSpacing;
export type TextStyle = keyof typeof TEXT_STYLES;