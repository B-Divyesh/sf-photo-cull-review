import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://photo-cull-review.sociobot.in';
const browser = await chromium.launch({ headless: true });
const result = {};

async function inspectRoute(path, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('request', (request) => requests.push(request.url()));
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  const seriousCritical = axe.violations
    .filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))
    .map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length }));
  const semantics = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: [...document.querySelectorAll('h1')].map((node) => node.textContent?.replace(/\s+/g, ' ').trim()),
    mainCount: document.querySelectorAll('main').length,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  await context.close();
  return {
    status: response?.status(),
    ...semantics,
    seriousCritical,
    errors,
    origins: [...new Set(requests.map((url) => new URL(url).origin))],
  };
}

result.routes = {};
for (const path of ['/', '/?demo=1', '/privacy/', '/terms/', '/missing-verification-route']) {
  result.routes[path] = await inspectRoute(path);
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  const box = await action.boundingBox();
  result.firstReadDesktop = {
    heading: (await page.getByRole('heading', { level: 1 }).innerText()).replace(/\s+/g, ' ').trim(),
    audience: await page.locator('.lede').innerText(),
    actionText: await action.innerText(),
    actionBox: box,
    actionFullyInFirstScreen: Boolean(box && box.y >= 0 && box.y + box.height <= 900),
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.factory/verification-artifacts/live-cold-mobile.png', fullPage: false });
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  const actionBox = await action.boundingBox();
  const targetNames = ['Photo Cull Review home'];
  const targets = {};
  for (const name of targetNames) targets[name] = await page.getByRole('link', { name }).boundingBox();
  result.mobile = {
    viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    actionBox,
    actionFullyInFirstScreen: Boolean(actionBox && actionBox.y >= 0 && actionBox.y + actionBox.height <= 844),
    targets,
    errors,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base);
  const focused = [];
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(20);
    focused.push(await page.evaluate(() => {
      const node = document.activeElement;
      const style = node ? getComputedStyle(node) : null;
      return {
        tag: node?.tagName,
        text: node?.textContent?.replace(/\s+/g, ' ').trim(),
        ariaLabel: node?.getAttribute('aria-label'),
        outline: style ? `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}` : null,
      };
    }));
  }
  result.keyboardAndMotion = {
    focused,
    scrollBehavior: await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    heroAnimationName: await page.locator('.hero-art').evaluate((node) => getComputedStyle(node).animationName),
  };
  await context.close();
}

{
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  const bannerBefore = await page.getByText(/Demo — sample data/).innerText();
  await page.getByRole('heading', { name: 'Your review desk' }).focus();
  await page.keyboard.press('k');
  await page.keyboard.press('r');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('k');
  await page.keyboard.press('r');
  await page.keyboard.press('ArrowRight');
  const ready = await page.getByRole('heading', { name: 'Your plan is ready' }).isVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export move manifest' }).first().click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  const csv = await (await import('node:fs/promises')).readFile(downloadPath, 'utf8');
  result.demoFlow = {
    bannerBefore,
    ready,
    downloadName: download.suggestedFilename(),
    csvFirstLines: csv.split('\n').slice(0, 4),
    origins: [...new Set(requests.map((url) => new URL(url).origin))],
    errors,
  };
  await page.getByRole('button', { name: 'Reset demo' }).click();
  result.demoFlow.resetKeepPressed = await page.getByRole('button', { name: /^Keep$/ }).first().getAttribute('aria-pressed');
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base);
  const { mkdtemp, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const invalidDirectory = await mkdtemp(join(tmpdir(), 'photo-cull-review-invalid-'));
  await writeFile(join(invalidDirectory, 'notes.txt'), 'not media');
  await page.locator('#folder-input').setInputFiles(invalidDirectory);
  const unsupported = await page.getByRole('alert').innerText();
  await page.goto(`${base}/?demo=1`);
  await page.locator('#import-input').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  const invalidBackup = await page.getByRole('alert').innerText();
  result.invalidRecovery = { unsupported, invalidBackup, deskStillVisible: await page.getByRole('heading', { name: 'Your review desk' }).isVisible() };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload({ waitUntil: 'networkidle' });
  const updateState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    const keys = await caches.keys();
    const counts = {};
    for (const key of keys) counts[key] = (await caches.open(key).then((cache) => cache.keys())).length;
    return {
      controlled: Boolean(navigator.serviceWorker.controller),
      active: registration.active?.state,
      waiting: registration.waiting?.state ?? null,
      cacheCounts: counts,
    };
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  result.pwa = {
    ...updateState,
    offlineStatus: await page.getByText(/Offline — your saved review/).innerText(),
    demoBannerOffline: await page.getByText(/Demo — sample data/).isVisible(),
    headingOffline: await page.getByRole('heading', { name: 'Your review desk' }).isVisible(),
  };
  await context.close();
}

{
  const paths = ['/', '/assets/app-v4.js', '/assets/app-v4.css', '/sw.js', '/manifest.webmanifest', '/missing-verification-route'];
  result.responses = {};
  for (const path of paths) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    result.responses[path] = {
      status: response.status,
      contentType: response.headers.get('content-type'),
      cacheControl: response.headers.get('cache-control'),
      csp: response.headers.get('content-security-policy'),
      hsts: response.headers.get('strict-transport-security'),
      xContentTypeOptions: response.headers.get('x-content-type-options'),
      referrerPolicy: response.headers.get('referrer-policy'),
      permissionsPolicy: response.headers.get('permissions-policy'),
      coop: response.headers.get('cross-origin-opener-policy'),
      corp: response.headers.get('cross-origin-resource-policy'),
      xFrameOptions: response.headers.get('x-frame-options'),
    };
  }
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
