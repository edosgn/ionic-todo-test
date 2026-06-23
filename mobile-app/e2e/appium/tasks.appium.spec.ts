/**
 * Tasks - Appium E2E Tests
 *
 * BDD-style end-to-end tests for task management using Appium.
 * These tests run on a real Android emulator/device and validate
 * the full user flow from the UI perspective.
 *
 * Prerequisites:
 * - Appium server running (appium &)
 * - Android emulator running (or device connected)
 * - APK built and available at the path specified in capabilities
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Browser } from 'webdriverio';
import { createDriver, deleteSession, waitForElement, SELECTORS } from './helpers/appium.setup';

describe('Feature: Gestion de tareas (Appium E2E)', function () {
  // Increase timeout for Appium tests
  this.timeout(120_000);

  let driver: Browser<'async'>;

  // -----------------------------------------------------------------------
  // Setup
  // -----------------------------------------------------------------------
  before(async () => {
    driver = await createDriver();

    // Ensure we're on the tasks page
    const tasksNav = await waitForElement(driver, SELECTORS.NAV_TASKS_TAB, 15000);
    await tasksNav.click();
    await driver.pause(2000);
  });

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------
  after(async () => {
    await deleteSession(driver);
  });

  // -----------------------------------------------------------------------
  // Scenario: Crear una nueva tarea
  // -----------------------------------------------------------------------
  describe('Scenario: Crear una nueva tarea', () => {
    it('should create a new task successfully', async () => {
      // Given - estamos en la pagina de tareas

      // When - hago clic en el FAB para agregar tarea
      const addButton = await driver.$(SELECTORS.ADD_TASK_BUTTON);
      await addButton.waitForDisplayed({ timeout: 5000 });
      await addButton.click();
      await driver.pause(1000);

      // And - completo el formulario
      const titleInput = await driver.$(SELECTORS.TASK_TITLE_INPUT);
      await titleInput.waitForDisplayed({ timeout: 5000 });
      await titleInput.setValue('Tarea de prueba Appium');
      await driver.pause(300);

      const descInput = await driver.$(SELECTORS.TASK_DESCRIPTION_INPUT);
      if (await descInput.isExisting()) {
        await descInput.setValue('Descripcion de prueba');
        await driver.pause(300);
      }

      // And - guardo la tarea
      const saveButton = await driver.$(SELECTORS.SAVE_TASK_BUTTON);
      await saveButton.click();
      await driver.pause(1500);

      // Then - la tarea aparece en la lista
      const taskItem = await driver.$('~task-item-Tarea de prueba Appium');
      const isDisplayed = await taskItem.isDisplayed();
      // eslint-disable-next-line no-unused-expressions
      expect(isDisplayed).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Marcar tarea como completada
  // -----------------------------------------------------------------------
  describe('Scenario: Marcar tarea como completada', () => {
    it('should mark a task as completed', async () => {
      // Given - creamos una tarea primero
      const addButton = await driver.$(SELECTORS.ADD_TASK_BUTTON);
      await addButton.click();
      await driver.pause(1000);

      const titleInput = await driver.$(SELECTORS.TASK_TITLE_INPUT);
      await titleInput.setValue('Tarea a completar');
      await driver.pause(300);

      const saveButton = await driver.$(SELECTORS.SAVE_TASK_BUTTON);
      await saveButton.click();
      await driver.pause(1500);

      // When - marco la tarea como completada
      const checkbox = await driver.$('~task-checkbox-Tarea a completar');
      if (await checkbox.isExisting()) {
        await checkbox.click();
        await driver.pause(1000);

        // Then - la tarea aparece como completada
        // In a real app, completed tasks have visual feedback
        const completedTask = await driver.$('~task-item-Tarea a completar');
        const className = await completedTask.getAttribute('className');
        expect(className).toContain('completed');
      }
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Filtrar tareas
  // -----------------------------------------------------------------------
  describe('Scenario: Filtrar tareas por busqueda', () => {
    it('should filter tasks by search text', async () => {
      // Given - tenemos multiples tareas
      // (asumimos que existen tareas de pruebas anteriores)

      // When - escribimos en el buscador
      const searchBar = await driver.$(SELECTORS.SEARCH_BAR);
      if (await searchBar.isExisting()) {
        await searchBar.click();
        await driver.pause(500);
        await searchBar.setValue('Appium');
        await driver.pause(1000);

        // Then - solo las tareas filtradas son visibles
        const filteredTasks = await driver.$$('~task-item');
        // There should be at least one task matching "Appium"
        expect(filteredTasks.length).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
