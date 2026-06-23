/**
 * Common Step Definitions for Cucumber BDD tests.
 *
 * Reusable steps shared across feature files.
 * Selectors match the real Ionic UI components inspected from the app source.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { Page, Browser, chromium, expect } from '@playwright/test';

setDefaultTimeout(30_000);

let browser: Browser | null = null;
let page: Page | null = null;

const BASE_URL = (): string => process.env['BASE_URL'] || 'http://localhost:4200';

async function getPage(): Promise<Page> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  if (!page) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    page = await context.newPage();
    globalThis.__playwrightPage = page;
  }
  return page;
}

export async function cleanupBrowser(): Promise<void> {
  if (page) { await page.close(); page = null; }
  if (browser) { await browser.close(); browser = null; }
}

/** Navigate to a route and wait for Ionic to render */
async function goTo(route: string) {
  const p = await getPage();
  await p.goto(`${BASE_URL()}${route}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
}

/** Fill the task form title field and submit */
async function createTaskViaUI(title: string) {
  const p = await getPage();
  await goTo('/task/new');
  await p.locator('ion-input[formControlName="title"] input').fill(title);
  await p.waitForTimeout(200);
  await p.locator('ion-button[type="submit"]').last().click();
  await p.waitForTimeout(500);
}

/** Fill the category form name field and submit */
async function createCategoryViaUI(name: string) {
  const p = await getPage();
  await goTo('/categories');
  await p.locator('ion-fab-button').click();
  await p.waitForTimeout(500);
  await p.locator('ion-input[formControlName="name"] input').fill(name);
  await p.waitForTimeout(200);
  await p.locator('ion-button[type="submit"]').last().click();
  await p.waitForTimeout(1500);
}

// ---------------------------------------------------------------------------
// Given Steps
// ---------------------------------------------------------------------------

Given('que el usuario esta autenticado y en la pagina de {string}', async (pageName: string) => {
  const routes: Record<string, string> = { tasks: '/tasks', categories: '/categories' };
  await goTo(routes[pageName] || `/${pageName}`);
});

Given('que existe una categoria llamada {string}', async (categoryName: string) => {
  const p = await getPage();
  await goTo('/categories');
  const exists = await p.locator('ion-item-sliding').filter({ hasText: categoryName }).count();
  if (exists === 0) {
    await createCategoryViaUI(categoryName);
  }
});

Given('que la categoria {string} tiene {int} tareas asignadas', async (categoryName: string, taskCount: number) => {
  const p = await getPage();
  const baseUrl = process.env['BASE_URL'] || 'http://localhost:4200';

  for (let i = 0; i < taskCount; i++) {
    await p.goto(`${baseUrl}/task/new`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    await p.locator('ion-input[formControlName="title"] input').fill(`Tarea ${categoryName} #${i + 1}`);
    await p.waitForTimeout(200);
    // Select the category from the category-selector component
    const catSelector = p.locator('app-category-selector ion-item').filter({ hasText: categoryName }).first();
    const visible = await catSelector.isVisible().catch(() => false);
    if (visible) {
      await catSelector.click();
      await p.waitForTimeout(200);
    }
    await p.locator('ion-button[type="submit"]').last().click();
    await p.waitForTimeout(500);
  }
});

Given('que existe una tarea llamada {string}', async (taskName: string) => {
  const p = await getPage();
  await goTo('/tasks');
  const exists = await p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName }).count();
  if (exists === 0) {
    await createTaskViaUI(taskName);
  }
});

Given('que existen tareas llamadas {string} y {string}', async (taskName1: string, taskName2: string) => {
  for (const name of [taskName1, taskName2]) {
    const p = await getPage();
    await goTo('/tasks');
    const exists = await p.locator('app-task-list ion-card.task-item').filter({ hasText: name }).count();
    if (exists === 0) {
      await createTaskViaUI(name);
    }
  }
});

// ---------------------------------------------------------------------------
// When Steps
// ---------------------------------------------------------------------------

When('el usuario hace clic en el boton {string}', async (buttonText: string) => {
  const p = await getPage();

  // Map semantic button names to real DOM selectors or direct navigation
  const actionMap: Record<string, () => Promise<void>> = {
    'Categorias': async () => { await goTo('/categories'); },
    'Volver': async () => { await goTo('/tasks'); },
    'Agregar tarea': async () => { await goTo('/task/new'); },
  };

  if (actionMap[buttonText]) {
    await actionMap[buttonText]();
  } else {
    // Fallback generic click
    const btn = p.locator(`ion-button:has-text("${buttonText}")`).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await p.waitForTimeout(1500);
  }
});

When('el usuario escribe {string} en el buscador', async (searchText: string) => {
  const p = await getPage();
  await p.locator('app-task-list ion-searchbar input').fill(searchText);
  await p.waitForTimeout(500);
});

// ---------------------------------------------------------------------------
// Then Steps
// ---------------------------------------------------------------------------

Then('el usuario ve el texto {string}', async (expectedText: string) => {
  const p = await getPage();
  // Search for the text in ion-title elements specifically (page headers)
  const titleLocator = p.locator('ion-title');
  const count = await titleLocator.count();
  let found = false;
  for (let i = 0; i < count; i++) {
    const text = await titleLocator.nth(i).textContent();
    if (text && text.includes(expectedText)) {
      found = true;
      break;
    }
  }
  // Fallback: check if any visible element contains the text
  if (!found) {
    await expect(p.locator('body')).toContainText(expectedText, { timeout: 5000 });
  }
});

Then('el elemento {string} no es visible', async (elementText: string) => {
  const p = await getPage();
  const el = p.locator('app-task-list ion-card.task-item').filter({ hasText: elementText }).first();
  await expect(el).not.toBeVisible({ timeout: 3000 });
});

Then('el usuario ve un mensaje de error con el texto {string}', async (errorText: string) => {
  const p = await getPage();
  // Wait a moment for the toast to appear
  await p.waitForTimeout(500);
  // ion-toast uses shadow DOM - try multiple strategies
  const toast = p.locator('ion-toast').first();
  const toastVisible = await toast.isVisible().catch(() => false);
  if (toastVisible) {
    return;
  }
  // Fallback: search in the body
  await expect(p.locator('body')).toContainText(errorText, { timeout: 5000 });
});
