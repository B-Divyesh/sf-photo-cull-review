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

test('@regression:mobile-header every visible header control is readable, separated, and at least 44px at 390px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile target measurement');
  await page.goto('/');

  const targets = page.locator('header.site-header .brand, header.site-header nav > *');
  const boxes = [];
  for (let index = 0; index < await targets.count(); index += 1) {
    const locator = targets.nth(index);
    const box = await locator.boundingBox();
    expect(box, 'target must have a rendered box').not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(Number.parseFloat(await locator.evaluate((element) => getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
    boxes.push(box!);
  }
  for (let first = 0; first < boxes.length; first += 1) {
    for (let second = first + 1; second < boxes.length; second += 1) {
      const a = boxes[first]!;
      const b = boxes[second]!;
      const horizontalGap = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width), 0);
      const verticalGap = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height), 0);
      expect(Math.max(horizontalGap, verticalGap), 'adjacent header targets need 8px separation').toBeGreaterThanOrEqual(7.9);
    }
  }

  for (const locator of [
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Opens a four-file sample review immediately.'),
    page.locator('.trust-facts'),
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

test('a newly installed worker announces the available update', async ({ page }) => {
  await page.addInitScript(() => {
    const worker = new EventTarget() as EventTarget & { state: string };
    worker.state = 'installing';
    const registration = new EventTarget() as EventTarget & { installing: typeof worker };
    registration.installing = worker;
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { controller: {}, register: async () => registration },
    });
    (window as typeof window & { triggerWorkerUpdate?: () => void }).triggerWorkerUpdate = () => {
      registration.dispatchEvent(new Event('updatefound'));
      worker.state = 'installed';
      worker.dispatchEvent(new Event('statechange'));
    };
  });
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await expect.poll(() => page.evaluate(() => typeof (window as typeof window & { triggerWorkerUpdate?: () => void }).triggerWorkerUpdate)).toBe('function');
  await page.evaluate(() => (window as typeof window & { triggerWorkerUpdate: () => void }).triggerWorkerUpdate());
  await expect(page.getByRole('status')).toContainText('An update is ready. Reload to use it.');
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

test('@regression:unverified-license an unavailable first verification stays free and rejects 751 files', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=qa-unavailable-license', (route) => route.abort('failed'));
  await page.goto('/?license=qa-unavailable-license');

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('status').filter({ hasText: 'We could not verify this license.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Archive pass' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Archive pass active' })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:photo-cull-review:verdict'))).toBeNull();

  await page.locator('#folder-input').evaluate((element) => {
    const input = element as HTMLInputElement;
    const transfer = new DataTransfer();
    for (let index = 0; index < 751; index += 1) {
      const file = new File(['x'], `clip-${index}.mp4`, { type: 'video/mp4' });
      Object.defineProperty(file, 'webkitRelativePath', { value: `Archive/clip-${index}.mp4` });
      transfer.items.add(file);
    }
    Object.defineProperty(input, 'files', { configurable: true, value: transfer.files });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.getByRole('alert')).toContainText('free archive desk scans up to 750');
  await expect(page.locator('.scan-count')).toHaveCount(0);
});

test('a previously successful verdict remains active when its daily recheck is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:photo-cull-review', 'previously-verified-license');
    localStorage.setItem('sb_license:photo-cull-review:verdict', JSON.stringify({
      valid: true,
      reason: 'ok',
      checkedAt: Date.now() - 86_400_001,
    }));
  });
  await page.route('https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=previously-verified-license', (route) => route.abort('failed'));
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Archive pass active' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'last successful check remains active' })).toBeVisible();
});

test('an invalid checkout return shows the quiet inactive-license notice and buy link', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=invalid-return-license', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }),
  }));
  await page.goto('/?license=invalid-return-license');

  const notice = page.getByRole('status').filter({ hasText: 'This license is no longer active.' });
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('link', { name: 'Buy Archive pass' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/photo-cull-review/checkout');
  await expect(page.getByRole('button', { name: 'Archive pass active' })).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('license dialog receives focus, closes with Escape, and returns focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Archive pass' });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Archive pass' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close license dialog' })).toBeFocused();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Archive pass' })).not.toBeVisible();
  await expect(trigger).toBeFocused();
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

test('@regression:route-social-metadata every public route provides its own complete social card', async ({ page }) => {
  const routes = [
    { path: '/', title: 'Photo Cull Review — plan duplicate photo moves', canonical: 'https://photo-cull-review.sociobot.in/' },
    { path: '/?demo=1', title: 'Demo — Photo Cull Review', canonical: 'https://photo-cull-review.sociobot.in/?demo=1' },
    { path: '/privacy/', title: 'Privacy — Photo Cull Review', canonical: 'https://photo-cull-review.sociobot.in/privacy/' },
    { path: '/terms/', title: 'Terms — Photo Cull Review', canonical: 'https://photo-cull-review.sociobot.in/terms/' },
    { path: '/404.html', title: 'Page not found — Photo Cull Review', canonical: 'https://photo-cull-review.sociobot.in/404.html' },
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', route.canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://photo-cull-review.sociobot.in/assets/social-preview.jpg');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://photo-cull-review.sociobot.in/assets/social-preview.jpg');
  }
});

test('@regression:text-reflow home, demo, legal, and not-found routes reflow at 200% on 390px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '390px text reflow measurement');
  for (const route of ['/', '/?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expect.poll(() => page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))).toEqual({ clientWidth: 390, scrollWidth: 390 });
  }
});
