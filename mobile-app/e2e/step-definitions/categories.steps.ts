/**
 * Category Step Definitions for Cucumber BDD tests.
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

// ---------------------------------------------------------------------------
// When Steps
// ---------------------------------------------------------------------------

When('el usuario abre el formulario de creacion de categoria', async () => {
  const p = await getPage();
  await p.locator('ion-fab-button').first().click();
  await p.waitForTimeout(500);
});

When('completa el formulario de categoria con:', async (dataTable: any) => {
  const p = await getPage();
  for (const row of dataTable.hashes()) {
    if (row.nombre) {
      await p.locator('ion-input[formControlName="name"] input').fill(row.nombre);
      await p.waitForTimeout(200);
    }
  }
});

When('guarda la categoria', async () => {
  const p = await getPage();
  await p.locator('ion-button[type="submit"]').last().click();
  await p.waitForTimeout(1000);
});

When('el usuario intenta eliminar la categoria {string}', async (categoryName: string) => {
  const p = await getPage();

  // Ensure we are on the categories page without full reload if already there
  const currentUrl = p.url();
  const categoriesUrl = `${process.env['BASE_URL'] || 'http://localhost:4200'}/categories`;
  if (!currentUrl.includes('/categories')) {
    await p.goto(categoriesUrl, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
  }

  // Try to find and click the delete button via aria-label
  const deleteBtn = p.locator(`ion-button[aria-label="Eliminar ${categoryName}"]`).first();
  const visible = await deleteBtn.isVisible().catch(() => false);
  if (visible) {
    await deleteBtn.click();
    await p.waitForTimeout(500);
    return;
  }

  // Fallback: click the trash icon inside the sliding item for that category
  const item = p.locator('ion-item-sliding').filter({ hasText: categoryName }).first();
  const trashBtn = item.locator('ion-button[color="danger"]').first();
  if (await trashBtn.isVisible().catch(() => false)) {
    await trashBtn.click();
    await p.waitForTimeout(500);
    return;
  }

  // Last fallback
  const trashIcon = item.locator('ion-icon[name="trash"]').first();
  if (await trashIcon.isVisible().catch(() => false)) {
    await trashIcon.click();
    await p.waitForTimeout(500);
    return;
  }

  throw new Error(`Could not find delete button for category: ${categoryName}`);
});

When('confirma la eliminacion', async () => {
  const p = await getPage();
  const confirmBtn = p.locator('ion-alert .alert-button-role-destructive').first();
  if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await confirmBtn.click();
    await p.waitForTimeout(500);
  }
});

When('el usuario abre el formulario de edicion de la categoria {string}', async (categoryName: string) => {
  const p = await getPage();
  await p.goto(`${process.env['BASE_URL'] || 'http://localhost:4200'}/categories`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);

  const item = p.locator('ion-item-sliding').filter({ hasText: categoryName }).first();
  const editBtn = item.locator('ion-button[color="primary"]').first();
  if (await editBtn.isVisible().catch(() => false)) {
    await editBtn.click();
    await p.waitForTimeout(500);
    return;
  }
  const editIcon = item.locator('ion-icon[name="create"]').first();
  await editIcon.click();
  await p.waitForTimeout(500);
});

// ---------------------------------------------------------------------------
// Then Steps
// ---------------------------------------------------------------------------

Then('la categoria {string} aparece en la lista', async (categoryName: string) => {
  const p = await getPage();
  const item = p.locator('ion-item-sliding').filter({ hasText: categoryName }).first();
  await expect(item).toBeVisible({ timeout: 5000 });
});

Then('la categoria {string} ya no aparece en la lista', async (categoryName: string) => {
  const p = await getPage();
  await p.waitForTimeout(500);
  const item = p.locator('ion-item-sliding').filter({ hasText: categoryName });
  const count = await item.count();
  if (count > 0) {
    await expect(item.first()).not.toBeVisible({ timeout: 3000 });
  }
});

Then('la categoria {string} permanece en la lista', async (categoryName: string) => {
  const p = await getPage();
  const item = p.locator('ion-item-sliding').filter({ hasText: categoryName }).first();
  await expect(item).toBeVisible({ timeout: 3000 });
});
