import { defineConfig, devices } from '@playwright/test';

const applicationSuites = [
  { name: 'core', grep: /@suite:core/ },
  { name: 'license', grep: /@suite:license/ },
  { name: 'claims', grep: /@suite:claims/ },
  { name: 'routes', grep: /@suite:routes/ },
] as const;

export default defineConfig({
  testDir: './tests',
  // Serial browser contexts keep the PWA/offline checks reliable in constrained
  // workers and avoid Chromium process crashes during parallel context startup.
  workers: 1,
  retries: 1,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--disable-gpu'] },
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
  projects: [
    ...applicationSuites.flatMap(({ name, grep }) => [
      {
        name: `chromium-${name}`,
        testIgnore: /pwa\.spec\.ts/,
        grep,
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: `mobile-${name}`,
        testIgnore: /pwa\.spec\.ts/,
        grep,
        use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
      },
    ]),
    {
      // Service-worker and offline state live in their own worker/browser so
      // they cannot destabilize the ordinary desktop and mobile suites.
      name: 'pwa-offline',
      testMatch: /pwa\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
