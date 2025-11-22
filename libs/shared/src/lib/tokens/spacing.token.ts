/**
 * Spacing Design Tokens
 * 
 * Defines the spacing system including margins, padding, gaps, and layout spacing
 * following a consistent scale for the design system.
 */

export const SPACING = {
  // Base spacing scale (rem values)
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

/**
 * Semantic spacing for common use cases
 */
export const SEMANTIC_SPACING = {
  // Component internal spacing
  componentPadding: {
    xs: SPACING[1],     // 4px
    sm: SPACING[2],     // 8px
    md: SPACING[4],     // 16px
    lg: SPACING[6],     // 24px
    xl: SPACING[8],     // 32px
  },

  // Content spacing
  contentSpacing: {
    xs: SPACING[2],     // 8px
    sm: SPACING[4],     // 16px
    md: SPACING[6],     // 24px
    lg: SPACING[8],     // 32px
    xl: SPACING[12],    // 48px
  },

  // Layout spacing
  layoutSpacing: {
    xs: SPACING[4],     // 16px
    sm: SPACING[6],     // 24px
    md: SPACING[8],     // 32px
    lg: SPACING[12],    // 48px
    xl: SPACING[16],    // 64px
    '2xl': SPACING[24], // 96px
  },

  // Form spacing
  formSpacing: {
    fieldGap: SPACING[4],        // 16px - between form fields
    labelGap: SPACING[2],        // 8px - between label and input
    buttonGap: SPACING[3],       // 12px - between buttons
    sectionGap: SPACING[8],      // 32px - between form sections
  },

  // Card spacing
  cardSpacing: {
    padding: SPACING[4],         // 16px - card internal padding
    gap: SPACING[4],            // 16px - between cards
    headerGap: SPACING[3],      // 12px - between card header elements
    contentGap: SPACING[2],     // 8px - between card content elements
  },

  // List spacing
  listSpacing: {
    itemPadding: SPACING[4],    // 16px - list item padding
    itemGap: SPACING[1],        // 4px - between list items
    nestedIndent: SPACING[6],   // 24px - nested list indentation
  },

  // Navigation spacing
  navigationSpacing: {
    itemPadding: SPACING[3],    // 12px - nav item padding
    itemGap: SPACING[1],        // 4px - between nav items
    sectionGap: SPACING[6],     // 24px - between nav sections
  },

  // Button spacing
  buttonSpacing: {
    padding: {
      sm: `${SPACING[2]} ${SPACING[3]}`,    // 8px 12px
      md: `${SPACING[3]} ${SPACING[4]}`,    // 12px 16px
      lg: `${SPACING[4]} ${SPACING[6]}`,    // 16px 24px
    },
    gap: SPACING[2],            // 8px - between button content
    groupGap: SPACING[3],       // 12px - between buttons in group
  },

  // Icon spacing
  iconSpacing: {
    withText: SPACING[2],       // 8px - icon next to text
    inButton: SPACING[1.5],     // 6px - icon in button
    standalone: SPACING[2],     // 8px - standalone icon padding
  },
} as const;

/**
 * Breakpoint-specific spacing values
 */
export const RESPONSIVE_SPACING = {
  containerPadding: {
    mobile: SPACING[4],         // 16px
    tablet: SPACING[6],         // 24px
    desktop: SPACING[8],        // 32px
  },
  
  sectionSpacing: {
    mobile: SPACING[8],         // 32px
    tablet: SPACING[12],        // 48px
    desktop: SPACING[16],       // 64px
  },

  cardGap: {
    mobile: SPACING[4],         // 16px
    tablet: SPACING[6],         // 24px
    desktop: SPACING[8],        // 32px
  },
} as const;

/**
 * Spacing utilities
 */
export const SpacingUtils = {
  /**
   * Convert spacing token to pixels (assuming 16px base)
   */
  toPx(spacingValue: string): number {
    if (spacingValue === '0') return 0;
    if (spacingValue === '1px') return 1;
    return parseFloat(spacingValue.replace('rem', '')) * 16;
  },

  /**
   * Get spacing value by key
   */
  get(key: keyof typeof SPACING): string {
    return SPACING[key];
  },

  /**
   * Create spacing utilities for CSS-in-JS
   */
  createSpacingUtilities() {
    const utilities: Record<string, string> = {};
    
    // Margin utilities
    Object.entries(SPACING).forEach(([key, value]) => {
      utilities[`m-${key}`] = `margin: ${value}`;
      utilities[`mt-${key}`] = `margin-top: ${value}`;
      utilities[`mr-${key}`] = `margin-right: ${value}`;
      utilities[`mb-${key}`] = `margin-bottom: ${value}`;
      utilities[`ml-${key}`] = `margin-left: ${value}`;
      utilities[`mx-${key}`] = `margin-left: ${value}; margin-right: ${value}`;
      utilities[`my-${key}`] = `margin-top: ${value}; margin-bottom: ${value}`;
    });

    // Padding utilities
    Object.entries(SPACING).forEach(([key, value]) => {
      utilities[`p-${key}`] = `padding: ${value}`;
      utilities[`pt-${key}`] = `padding-top: ${value}`;
      utilities[`pr-${key}`] = `padding-right: ${value}`;
      utilities[`pb-${key}`] = `padding-bottom: ${value}`;
      utilities[`pl-${key}`] = `padding-left: ${value}`;
      utilities[`px-${key}`] = `padding-left: ${value}; padding-right: ${value}`;
      utilities[`py-${key}`] = `padding-top: ${value}; padding-bottom: ${value}`;
    });

    // Gap utilities
    Object.entries(SPACING).forEach(([key, value]) => {
      utilities[`gap-${key}`] = `gap: ${value}`;
      utilities[`gap-x-${key}`] = `column-gap: ${value}`;
      utilities[`gap-y-${key}`] = `row-gap: ${value}`;
    });

    return utilities;
  },

  /**
   * Calculate responsive spacing based on screen size
   */
  getResponsiveValue(values: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }): string {
    const mobile = values.mobile || SPACING[4];
    const tablet = values.tablet || values.mobile || SPACING[6];
    const desktop = values.desktop || values.tablet || values.mobile || SPACING[8];

    return `${mobile} /* mobile: ${mobile}, tablet: ${tablet}, desktop: ${desktop} */`;
  },
};

// Export types
export type SpacingKey = keyof typeof SPACING;
export type ComponentPadding = keyof typeof SEMANTIC_SPACING.componentPadding;
export type ContentSpacing = keyof typeof SEMANTIC_SPACING.contentSpacing;
export type LayoutSpacing = keyof typeof SEMANTIC_SPACING.layoutSpacing;