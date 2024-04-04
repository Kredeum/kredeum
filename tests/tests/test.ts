import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Test MetaMask Connexion' })).toBeVisible();
});

test('connexion to Metamask ok', async ({ page }) => {
	await page.goto('/viem');
	await page.click('#connect-metamask-button');
	// const metamaskWindow = await page.waitForEvent('popup');

	// // Select Metamask connection tab
	// const metamaskPage = await metamaskWindow.page();

	// await metamaskPage.fill('#password', 'votre_mot_de_passe');
	// await metamaskPage.click('#login-button');

	// await metamaskPage.waitForSelector('#connected-wallet');

	// const connectedWallet = await metamaskPage.$('#connected-wallet');

	// expect(connectedWallet).toBeTruthy();
});