import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables dari file .env
dotenv.config();

/**
 * Playwright Configuration
 * Integration: Qase TestOps
 * Qase Project Code: AGA
 */
export default defineConfig({
  // Folder tempat file automation test
  testDir: './tests',

  // Menjalankan test secara parallel
  fullyParallel: true,

  // Mencegah test.only tertinggal ketika berjalan di CI
  forbidOnly: !!process.env.CI,

  // Retry 2 kali jika berjalan di CI
  retries: process.env.CI ? 2 : 0,

  // CI menggunakan 1 worker, lokal mengikuti default Playwright
  workers: process.env.CI ? 1 : undefined,

  /**
   * Reporter:
   * 1. HTML = report lokal Playwright
   * 2. Qase = mengirim hasil automation ke Qase TestOps
   */
  reporter: [
    ['html'],
    [
      'playwright-qase-reporter',
      {
        mode: 'testops',
        debug: true,

        testops: {
          api: {
            token: process.env.QASE_TESTOPS_API_TOKEN,
          },

          project: 'AGA',

          run: {
            complete: true,
          },
        },
      },
    ],
  ],

  /**
   * Konfigurasi umum browser
   */
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /**
   * Browser yang digunakan untuk testing
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});