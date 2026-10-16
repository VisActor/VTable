import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3010',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    }
  ],
  webServer: {
    command: 'rushx e2e:serve',
    url: 'http://127.0.0.1:3010',
    reuseExistingServer: !process.env.CI
  }
});
