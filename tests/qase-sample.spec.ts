import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test('Verify Google Page Title', async ({ page }) => {
  qase.id(211);
  qase.comment('Memverifikasi title halaman Google setelah dibuka.');

  await test.step(
    qase.step('Buka halaman Google', 'Halaman Google berhasil dimuat', undefined),
    async () => {
      await page.goto('https://google.com');

      const screenshot = await page.screenshot({ fullPage: true });
      qase.attach({
        name: 'google-homepage.png',
        content: screenshot,
        contentType: 'image/png',
      });
    },
  );

  await test.step(
    qase.step('Verifikasi title halaman', 'Title harus tepat "Google"', undefined),
    async () => {
      await expect(page).toHaveTitle('Google');
    },
  );

  qase.comment('Test selesai — title halaman Google valid.');
});
