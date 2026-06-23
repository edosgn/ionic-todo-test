/**
 * Cucumber.js Configuration
 *
 * Configuration file for cucumber-js.
 * Defines paths to feature files, step definitions, and runtime options.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

const common = {
  requireModule: ['ts-node/register'],
  require: [
    'e2e/step-definitions/**/*.steps.ts',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
  publishQuiet: true,
  retry: 0,
  timeout: 30000,
};

module.exports = {
  default: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    format: [
      'progress',
      'html:e2e/reports/cucumber-report.html',
      'json:e2e/reports/cucumber-report.json',
    ],
  },
  // Dry-run: solo valida sintaxis sin ejecutar (no requiere navegador)
  dry: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    dryRun: true,
    format: ['progress', 'summary'],
  },
  // Specific profiles for different test suites
  categories: {
    ...common,
    paths: ['e2e/features/categories.feature'],
    format: ['progress', 'summary'],
  },
  tasks: {
    ...common,
    paths: ['e2e/features/tasks.feature'],
    format: ['progress', 'summary'],
  },
  navigation: {
    ...common,
    paths: ['e2e/features/navigation.feature'],
    format: ['progress', 'summary'],
  },
};
