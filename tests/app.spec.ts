import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';

test('welcome is accessible and explains the safety boundary', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (item) => { if (item.type() === 'error') errors.push(item.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Photo Cull Review/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByText('No deletion access')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('indexes exact copies, records decisions, and exports a plan', async ({ page }) => {
  await page.goto('/');
  await page.locator('#folder-input').setInputFiles(path.join(process.cwd(), 'tests/fixtures'));
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('heading', { name: 'These files are exact copies' })).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: /^Keep$/ }).first().click();
  await page.getByRole('button', { name: /Move to review/ }).nth(1).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export move manifest' }).first().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/move-manifest.*\.csv/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible();
  await expect(page.getByText('1 marked for the review folder so far.')).toBeVisible();
});

test('the installed shell reopens offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline — your saved review/)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
