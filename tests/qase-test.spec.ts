import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test('Verify Example Page', async ({ page }) => {
  qase.id(1);
  qase.comment('Memverifikasi title halaman example.com.');

  await test.step(
    qase.step('Buka halaman example.com', 'Halaman berhasil dimuat', undefined),
    async () => {
      await page.goto('https://example.com');

      const screenshot = await page.screenshot({ fullPage: true });
      qase.attach({
        name: 'example-homepage.png',
        content: screenshot,
        contentType: 'image/png',
      });
    },
  );

  await test.step(
    qase.step(
      'Verifikasi title halaman',
      'Title harus mengandung "Example Domain"',
      undefined,
    ),
    async () => {
      await expect(page).toHaveTitle(/Example Domain/);
    },
  );

  qase.comment('Test selesai — title example.com valid.');
});
