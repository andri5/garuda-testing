import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test('Verify Example Page', async ({ page }) => {
  qase.id(1);

  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example Domain/);
});