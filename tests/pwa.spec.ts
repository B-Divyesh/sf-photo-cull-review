import { expect, test } from '@playwright/test';

test('@claim:offline-reload the installed demo reopens offline with sample data and decisions', async ({ browser }) => {
  const offlineContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1280, height: 720 },
  });

  try {
    const page = await offlineContext.newPage();
    await page.goto('/?demo=1');
    await expect(page.getByRole('heading', { name: 'Review duplicate and burst photos' })).toBeVisible();
    await page.getByRole('heading', { name: 'Review duplicate and burst photos' }).focus();
    await page.keyboard.press('r');
    await expect(page.getByRole('button', { name: /Move to review/ }).first()).toHaveAttribute('aria-pressed', 'true');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Review duplicate and burst photos' })).toBeVisible();
    await expect(page.getByText('Demo — sample data, separate from your workspace')).toBeVisible();
    await expect(page.locator('img[alt^="Preview of"]')).toHaveCount(2);
    await expect(page.getByRole('button', { name: /Move to review/ }).first()).toHaveAttribute('aria-pressed', 'true');
    const update = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return { active: registration.active?.scriptURL ?? null, waiting: Boolean(registration.waiting) };
    });
    expect(update.active).toContain('/sw.js');
    expect(update.waiting).toBe(false);
    await offlineContext.setOffline(true);
    await page.reload();
    await expect(page.getByText(/Offline — your saved review/)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally {
    // Close only the context created by this test. The shared browser belongs
    // to Playwright and must remain available for the lifecycle regression.
    await offlineContext.close();
  }

  expect(browser.isConnected()).toBe(true);
});

test('@regression:preview-lifecycle offline teardown leaves the shared browser and preview available', async ({ browser }) => {
  expect(browser.isConnected()).toBe(true);

  const recoveryContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  try {
    const response = await recoveryContext.request.get('/');
    expect(response.ok()).toBe(true);

    const page = await recoveryContext.newPage();
    await page.goto('/?demo=1');
    await expect(page.getByRole('heading', { name: 'Review duplicate and burst photos' })).toBeVisible();
  } finally {
    await recoveryContext.close();
  }

  expect(browser.isConnected()).toBe(true);
});
