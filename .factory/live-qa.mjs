import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.QA_BASE_URL || 'https://photo-cull-review.sociobot.in';
const browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
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
    social: {
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
      twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
    },
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
  const { mkdir } = await import('node:fs/promises');
  await mkdir('.factory/polish-3-artifacts', { recursive: true });
  await page.screenshot({ path: '.factory/polish-3-artifacts/cold-mobile-390x844.png', fullPage: false });
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  const actionBox = await action.boundingBox();
  const targets = await page.locator('header.site-header .brand, header.site-header nav > *').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return {
      name: element.getAttribute('aria-label') || element.textContent?.trim(),
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      fontSize: getComputedStyle(element).fontSize,
    };
  }));
  const factsBox = await page.locator('.trust-facts').boundingBox();
  result.mobile = {
    viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    actionBox,
    actionFullyInFirstScreen: Boolean(actionBox && actionBox.y >= 0 && actionBox.y + actionBox.height <= 844),
    factsFullyInFirstScreen: Boolean(factsBox && factsBox.y >= 0 && factsBox.y + factsBox.height <= 844),
    targets,
    errors,
  };
  await context.close();
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  const boxes = {};
  for (const [name, locator] of [
    ['group', page.getByRole('heading', { name: 'These files are exact copies' })],
    ['filename', page.getByRole('heading', { name: 'IMG_2041.jpg' })],
    ['decision', page.locator('[data-id="demo-picnic-1"][data-decision="keep"]')],
  ]) {
    const box = await locator.boundingBox();
    boxes[name] = box ? { ...box, bottom: box.y + box.height } : null;
  }
  const suffix = viewport.width === 390 ? 'mobile-390x844' : 'desktop-1440x900';
  await page.screenshot({ path: `.factory/polish-3-artifacts/demo-${suffix}.png`, fullPage: false });
  result[`demoFirstViewport-${suffix}`] = {
    viewport,
    boxes,
    allFit: Object.values(boxes).every((box) => box && box.bottom <= viewport.height),
  };
  await context.close();
}

result.textReflow = {};
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ['/', '/?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    result.textReflow[path] = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      reflows: document.documentElement.scrollWidth === document.documentElement.clientWidth,
    }));
  }
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const verifyUrl = 'https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=qa-repair-4-unavailable';
  await page.route(verifyUrl, (route) => route.abort('failed'));
  await page.goto(`${base}/?license=qa-repair-4-unavailable`);
  await page.locator('.license-notice').waitFor();
  await page.locator('#folder-input').evaluate((element) => {
    const transfer = new DataTransfer();
    for (let index = 0; index < 751; index += 1) {
      const file = new File(['x'], `clip-${index}.mp4`, { type: 'video/mp4' });
      Object.defineProperty(file, 'webkitRelativePath', { value: `Archive/clip-${index}.mp4` });
      transfer.items.add(file);
    }
    Object.defineProperty(element, 'files', { configurable: true, value: transfer.files });
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.getByRole('alert').waitFor();
  result.unavailableLicense = await page.evaluate(() => ({
    url: location.href,
    verdict: localStorage.getItem('sb_license:photo-cull-review:verdict'),
    active: [...document.querySelectorAll('button')].some((button) => button.getAttribute('aria-label') === 'Archive pass active'),
    notice: document.querySelector('.license-notice')?.textContent?.replace(/\s+/g, ' ').trim(),
    limitMessage: document.querySelector('[role="alert"]')?.textContent?.replace(/\s+/g, ' ').trim(),
    scanStarted: Boolean(document.querySelector('.scan-count')),
  }));
  await context.close();
}

{
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem('sb_license:photo-cull-review', 'qa-repair-4-cached');
    localStorage.setItem('sb_license:photo-cull-review:verdict', JSON.stringify({
      valid: true,
      reason: 'ok',
      checkedAt: Date.now() - 86_400_001,
    }));
  });
  const page = await context.newPage();
  await page.route('https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=qa-repair-4-cached', (route) => route.abort('failed'));
  await page.goto(base);
  await page.locator('.license-notice').waitFor();
  result.cachedLicenseFallback = await page.evaluate(() => ({
    active: [...document.querySelectorAll('button')].some((button) => button.getAttribute('aria-label') === 'Archive pass active'),
    notice: document.querySelector('.license-notice')?.textContent?.replace(/\s+/g, ' ').trim(),
  }));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base);
  await page.getByRole('heading', { level: 1 }).waitFor();
  const focused = [];
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
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
  await page.getByRole('heading', { name: 'Review duplicate and burst photos' }).focus();
  await page.keyboard.press('k');
  await page.keyboard.press('r');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('k');
  await page.keyboard.press('r');
  await page.keyboard.press('ArrowRight');
  const ready = await page.getByRole('heading', { name: 'Your plan is ready' }).isVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export move plan' }).first().click();
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
  result.invalidRecovery = { unsupported, invalidBackup, deskStillVisible: await page.getByRole('heading', { name: 'Review duplicate and burst photos' }).isVisible() };
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
    headingOffline: await page.getByRole('heading', { name: 'Review duplicate and burst photos' }).isVisible(),
  };
  await context.close();
}

{
  const paths = ['/', '/assets/app-v9.js', '/assets/app-v9.css', '/icons/apple-touch-icon.png', '/sw.js', '/manifest.webmanifest', '/missing-verification-route'];
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

{
  const checkout = await fetch('https://api.sociobot.in/api/v1/products/photo-cull-review/checkout', { redirect: 'follow' });
  const page = await checkout.text();
  const valid = checkout.ok
    && /^https:\/\/checkout\.dodopayments\.com\/session\//.test(checkout.url)
    && page.includes('Photo Cull Review')
    && page.includes('Pay in <!-- -->USD')
    && page.includes('Subtotal</span><span class="text-text-secondary text-sm font-normal">$12.00')
    && page.includes('Total</span><span class="text-text-primary text-md font-medium">$12.00');
  if (!valid) throw new Error('Live checkout no longer matches the Photo Cull Review USD $12.00 contract.');
  result.checkoutContract = {
    checkoutUrl: checkout.url,
    item: 'Photo Cull Review',
    currency: 'USD',
    subtotal: '$12.00',
    total: '$12.00',
  };
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
