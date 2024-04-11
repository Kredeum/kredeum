import { expect, test } from '@playwright/test';

test('index page title ok', async ({ page }) => {
	await page.goto('/');
  await expect(page).toHaveTitle('Playwright Tests');
});
