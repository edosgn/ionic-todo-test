/**
 * Design Tokens Index
 * 
 * Central export point for all design tokens including colors, typography,
 * spacing, and other design system foundations.
 */

export * from './colors.token';
export * from './typography.token';
export * from './spacing.token';

// Re-export commonly used tokens for convenience
export { COLORS } from './colors.token';
export { TYPOGRAPHY, TEXT_STYLES } from './typography.token';
export { SPACING, SEMANTIC_SPACING } from './spacing.token';