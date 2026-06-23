/**
 * Task Step Definitions for Cucumber BDD tests.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Page } from '@playwright/test';

declare global { var __playwrightPage: Page | undefined; }

async function getPage(): Promise<Page> {
  const p = globalThis.__playwrightPage;
  if (!p) throw new Error('Playwright page not initialized.');
  return p;
}

const BASE_URL = (): string => process.env['BASE_URL'] || 'http://localhost:4200';

// ---------------------------------------------------------------------------
// When Steps
// ---------------------------------------------------------------------------

When('el usuario abre el formulario de nueva tarea', async () => {
  const p = await getPage();
  await p.goto(`${BASE_URL()}/task/new`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
});

When('completa el formulario de tarea con:', async (dataTable: any) => {
  const p = await getPage();
  for (const row of dataTable.hashes()) {
    if (row.titulo) {
      await p.locator('ion-input[formControlName="title"] input').fill(row.titulo);
      await p.waitForTimeout(200);
    }
    if (row.descripcion) {
      const descInput = p.locator('ion-input[formControlName="description"] input');
      if (await descInput.isVisible().catch(() => false)) {
        await descInput.fill(row.descripcion);
        await p.waitForTimeout(200);
      }
    }
  }
});

When('guarda la tarea', async () => {
  const p = await getPage();
  await p.locator('ion-button[type="submit"]').last().click();
  await p.waitForTimeout(1000);
});

When('el usuario marca la tarea {string} como completada', async (taskName: string) => {
  const p = await getPage();
  await p.goto(`${BASE_URL()}/tasks`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const card = p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName }).first();
  await card.locator('ion-checkbox').first().click();
  await p.waitForTimeout(500);
});

When('el usuario elimina la tarea {string}', async (taskName: string) => {
  const p = await getPage();
  await p.goto(`${BASE_URL()}/tasks`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);

  // Use page.evaluate to click the delete button more reliably
  // The button has color="danger" and an ion-icon[name="trash"] inside the card
  const deleteBtnClicked = await p.evaluate((name: string) => {
    const cards = document.querySelectorAll('app-task-list ion-card.task-item');
    for (const card of cards) {
      if (card.textContent?.includes(name)) {
        const deleteBtn = card.querySelector('ion-button[color="danger"]') as HTMLElement;
        if (deleteBtn) {
          deleteBtn.click();
          return true;
        }
      }
    }
    return false;
  }, taskName);

  if (!deleteBtnClicked) {
    // Fallback: try Playwright click
    const deleteBtn = p.locator('app-task-list ion-card.task-item')
      .filter({ hasText: taskName })
      .locator('ion-button[color="danger"]')
      .first();
    await deleteBtn.waitFor({ state: 'visible', timeout: 8000 });
    await p.waitForTimeout(300);
    await deleteBtn.click({ force: true });
  }
  await p.waitForTimeout(1000);

  // Wait for the ion-alert confirmation dialog
  await p.locator('ion-alert').waitFor({ state: 'visible', timeout: 5000 });
  await p.waitForTimeout(500);

  // Click the destructive button in the alert using evaluate
  await p.evaluate(() => {
    const alert = document.querySelector('ion-alert');
    if (alert) {
      const destructiveBtn = alert.querySelector('.alert-button-role-destructive') as HTMLElement;
      if (destructiveBtn) {
        destructiveBtn.click();
      }
    }
  });
  await p.waitForTimeout(1000);
});

// ---------------------------------------------------------------------------
// Then Steps
// ---------------------------------------------------------------------------

Then('la tarea {string} aparece en la lista', async (taskName: string) => {
  const p = await getPage();
  const card = p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName }).first();
  await expect(card).toBeVisible({ timeout: 5000 });
});

Then('la tarea {string} aparece como completada', async (taskName: string) => {
  const p = await getPage();
  const card = p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName }).first();
  const checkbox = card.locator('ion-checkbox').first();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true', { timeout: 5000 });
});

Then('la tarea {string} ya no aparece en la lista', async (taskName: string) => {
  const p = await getPage();
  await p.waitForTimeout(500);
  const card = p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName });
  const count = await card.count();
  if (count > 0) {
    await expect(card.first()).not.toBeVisible({ timeout: 3000 });
  }
});

Then('la tarea {string} no es visible', async (taskName: string) => {
  const p = await getPage();
  const card = p.locator('app-task-list ion-card.task-item').filter({ hasText: taskName }).first();
  await expect(card).not.toBeVisible({ timeout: 3000 });
});

Then('la lista de tareas esta vacia', async () => {
  const p = await getPage();
  const cards = p.locator('app-task-list ion-card.task-item');
  expect(await cards.count()).toBe(0);
});
