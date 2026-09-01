import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('welcome is accessible and explains the safety boundary', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (item) => { if (item.type() === 'error') errors.push(item.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Photo Cull Review/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByText('Photos stay on this device')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('@regression:first-viewport cold desktop first screen shows the sample action, its outcome, and product facts', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto('/');

    const headline = await page.getByRole('heading', { level: 1 }).innerText();
    expect(headline.replace(/\s+/g, ' ').trim()).toBe(
      'Clean up duplicate photos. Before anything moves.',
    );
    await expect(page.locator('.lede')).toHaveText(
      'For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan.',
    );
    const sample = page.getByRole('link', { name: 'Try it with sample data' });
    const outcome = page.getByText('Opens a four-file sample review immediately.');
    const facts = page.locator('.trust-facts');
    await expect(sample).toBeVisible();
    await expect(outcome).toBeVisible();
    await expect(facts).toBeVisible();
    for (const locator of [sample, outcome, facts]) {
      const box = await locator.boundingBox();
      expect(box, 'first-screen content needs a rendered box').not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(900);
    }
  } finally {
    await context.close();
  }
});

test('invalid workspace JSON explains the problem and the next step without parser text', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.locator('#import-input').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{invalid'),
  });

  const alert = page.getByRole('alert');
  await expect(alert).toHaveText(
    'That file is not a Photo Cull Review backup. Choose a valid JSON backup exported from Photo Cull Review.',
  );
  await expect(alert).not.toContainText(/Expected|position|line|column/i);
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible();

  await page.locator('#import-input').setInputFiles({
    name: 'wrong-shape.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"product":"photo-cull-review","data":{"version":1,"assets":[],"groups":[]}}'),
  });
  await expect(page.getByRole('alert')).toHaveText(
    'That file is not a Photo Cull Review backup. Choose a valid JSON backup exported from Photo Cull Review.',
  );
});

test('@claim:exact-duplicates @claim:csv-export @claim:workspace-persistence indexes exact copies, records decisions, and exports a plan', async ({ page }) => {
  const fixture = path.join(process.cwd(), 'tests/fixtures/frame-001.jpg');
  const before = createHash('sha256').update(await readFile(fixture)).digest('hex');
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
  const downloadedPath = await download.path();
  expect(downloadedPath).toBeTruthy();
  expect(await readFile(downloadedPath!, 'utf8')).toContain('# PLAN ONLY — Photo Cull Review never moved or deleted these files.');
  expect(createHash('sha256').update(await readFile(fixture)).digest('hex')).toBe(before);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible();
  await expect(page.getByText('1 marked for the review folder so far.')).toBeVisible();
});

test('@claim:workspace-backup exports and restores a complete local workspace', async ({ page }) => {
  const fixtureDirectory = path.join(process.cwd(), 'tests/fixtures');
  await page.goto('/');
  await page.locator('#folder-input').setInputFiles(fixtureDirectory);
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: /^Keep$/ }).first().click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up workspace' }).click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  expect(backupPath).toBeTruthy();
  const backup = await readFile(backupPath!);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'New scan' }).click();
  await expect(page.getByRole('heading', { name: /Clean up duplicate photos/ })).toBeVisible();
  await page.locator('#folder-input').setInputFiles(fixtureDirectory);
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toHaveAttribute('aria-pressed', 'false');

  await page.locator('#import-input').setInputFiles({
    name: 'photo-cull-workspace.json',
    mimeType: 'application/json',
    buffer: backup,
  });
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toContainText('Workspace restored.');
});

test('sequential review shortcuts continue after focus moves to a decision button', async ({ page }) => {
  await page.goto('/');
  await page.locator('#folder-input').setInputFiles(path.join(process.cwd(), 'tests/fixtures'));
  const desk = page.getByRole('heading', { name: 'Your review desk' });
  await expect(desk).toBeVisible({ timeout: 20_000 });

  await desk.focus();
  await page.keyboard.press('k');
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toBeFocused();

  await page.keyboard.press('r');
  await expect(page.getByRole('button', { name: /Move to review/ }).nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.summary > div').nth(1)).toContainText('2of 2 candidates decided');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Your plan is ready' })).toBeVisible();
});

test('visible navigation links meet the 44px touch-target minimum at 390px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile target measurement');
  await page.goto('/');

  for (const locator of [
    page.getByRole('link', { name: 'Photo Cull Review home' }),
    page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }),
    page.getByRole('contentinfo').getByRole('link', { name: 'Terms' }),
  ]) {
    const box = await locator.boundingBox();
    expect(box, 'target must have a rendered box').not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  for (const locator of [
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Opens a four-file sample review immediately.'),
  ]) {
    const box = await locator.boundingBox();
    expect(box, 'sample start needs a rendered box').not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
});

test('@claim:offline-reload the installed shell reopens offline', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 720 },
  });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const update = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return { active: registration.active?.scriptURL ?? null, waiting: Boolean(registration.waiting) };
    });
    expect(update.active).toContain('/sw.js');
    expect(update.waiting).toBe(false);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText(/Offline — your saved review/)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:local-only free demo review sends no cross-origin requests', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, separate from your workspace')).toBeVisible();
  await page.keyboard.press('k');
  await page.keyboard.press('r');
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:license-verification-request verifies a supplied license with the only cross-origin runtime request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.route('https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=claim-license', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  const verification = page.waitForRequest((request) => request.url() === 'https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=claim-license');
  await page.goto('/?license=claim-license');
  await verification;
  await expect(page.getByRole('button', { name: 'Archive pass active' })).toBeVisible();

  const crossOrigin = requests.filter((url) => new URL(url).origin !== 'http://127.0.0.1:4173');
  expect(crossOrigin).toEqual(['https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=claim-license']);
});

test('@claim:demo-sandbox sample decisions stay separate and reset without setup', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Your review desk' })).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('heading', { name: 'Your review desk' }).focus();
  await page.keyboard.press('k');
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', { name: /^Keep$/ }).first()).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /Clean up duplicate photos/ })).toBeVisible();
});

test('privacy, terms, and 404 use the complete shared shell without serious accessibility issues', async ({ page }) => {
  for (const route of ['/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeVisible();
    await expect(page.locator('header.site-header').getByRole('link', { name: 'Photo Cull Review home' })).toBeVisible();
    await expect(page.locator('header.site-header').getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Demo' })).toBeVisible();
    await expect(page.locator('footer.site-footer')).toContainText('Built by Param Factory');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }

  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('https://photo-cull-review.sociobot.in/?demo=1');
});
