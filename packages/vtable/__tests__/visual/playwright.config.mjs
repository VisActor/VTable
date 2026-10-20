import path from 'node:path';
import { defineConfig } from '@playwright/test';
import { settings } from './settings.mjs';

const runDir = process.env.VISUAL_RUN_DIR;
const phase = process.env.VISUAL_PHASE;
if (!runDir || !['baseline', 'current'].includes(phase)) throw new Error('请通过 visual-test.mjs 运行');

export default defineConfig({
  testDir: '.',
  testMatch: 'visual.spec.mjs',
  workers: 1,
  retries: 0,
  timeout: settings.timeout,
  outputDir: path.join(runDir, `${phase}-results`),
  snapshotPathTemplate: path.join(runDir, 'snapshots', '{arg}{ext}'),
  updateSnapshots: phase === 'baseline' ? 'all' : 'none',
  expect: { timeout: 5000, toMatchSnapshot: settings.comparison },
  reporter: [
    ['line'],
    ['html', { outputFolder: path.join(runDir, `${phase}-report`), open: 'never' }],
    ['json', { outputFile: path.join(runDir, `${phase}-playwright.json`) }],
    ['./reporter.mjs']
  ],
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: settings.viewport,
    deviceScaleFactor: settings.deviceScaleFactor,
    locale: settings.locale,
    timezoneId: settings.timezoneId,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure'
  }
});
