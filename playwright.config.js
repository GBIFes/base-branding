import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

// e2e tests run against the built dist/ (npm run build first). They use a system Chromium when
// there is one (PW_CHROMIUM or /usr/bin/chromium), so no Playwright browser download is needed;
// otherwise Playwright's bundled Chromium (npx playwright install chromium).
const systemChromium = [process.env.PW_CHROMIUM, '/usr/bin/chromium'].find(p => p && fs.existsSync(p));

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  reporter: 'list',
  use: {
    viewport: { width: 1280, height: 800 },
    launchOptions: systemChromium ? { executablePath: systemChromium } : {}
  }
});
