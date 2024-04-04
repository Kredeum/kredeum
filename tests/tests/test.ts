// import { expect, test } from '@playwright/test';
import { test, expect } from "../synpressMetamaskTestFitures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { type Page } from "@playwright/test";

let sharedPage: Page;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ page }) => {
	sharedPage = page;
	await sharedPage.goto("/metamask");
});

test.afterAll(async ({ }) => {
	await sharedPage.close();
});

test('index page has expected h1', async ({ page }) => {
	// await page.goto('/metamask');
	await expect(page.getByRole('heading', { name: 'Test MetaMask Connexion' })).toBeVisible();
});

// test('connexion to Metamask ok', async ({ page }) => {
// 	await page.goto('/metamask');
// 	await page.click('#connect-metamask-button');
// 	const metamaskWindow = await page.waitForEvent('popup');

// 	// // Select Metamask connection tab
// 	// const metamaskPage = await metamaskWindow.page();

// 	// await metamaskPage.fill('#password', 'votre_mot_de_passe');
// 	// await metamaskPage.click('#login-button');

// 	// await metamaskPage.waitForSelector('#connected-wallet');

// 	// const connectedWallet = await metamaskPage.$('#connected-wallet');

// 	// expect(connectedWallet).toBeTruthy();
// });



test("connect wallet using default metamask account", async () => {
	await sharedPage.click("#connect-metamask-button");
	await metamask.acceptAccess();
	await expect(sharedPage.locator("#accounts")).toHaveText(
		"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
	);
});

test("import private key and connect wallet using imported metamask account", async () => {
	await metamask.disconnectWalletFromAllDapps();
	await metamask.importAccount(
		"0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97"
	);
	await sharedPage.click("#connect-metamask-button");
	await metamask.acceptAccess();
	await expect(sharedPage.locator("#accounts")).toHaveText(
		"0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f"
	);
});