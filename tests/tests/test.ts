// import { expect, test } from '@playwright/test';
import { type BrowserContext, expect, test as baseTest, chromium, firefox, webkit } from "@playwright/test";
import { type Page } from "@playwright/test";

import path from 'path';

import dappwright, { type Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

export const test = baseTest.extend<{
	context: BrowserContext;
	wallet: Dappwright;
	// globalContext: BrowserContext;
}>({
	// globalContext: [async ({ browserName }, use) => {
	// 	const browserTypes = { chromium, firefox, webkit };
	// 	const context = await browserTypes[browserName].launchPersistentContext(path.join(__dirname, 'ppp'), {});
	// 	await use(context);
	// 	await context.close();
	// }, { scope: 'test' }],

	// page: async ({ globalContext }, use) => {
	// 	const page = await globalContext.newPage();
	// 	await use(page);
	// 	await page.close();
	// },
	

	context: async ({ }, use) => {
		// Launch context with extension
		const [wallet, _, context] = await dappwright.bootstrap("", {
			wallet: "metamask",
			version: MetaMaskWallet.recommendedVersion,
			seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
			headless: false,
		});

		// Add Hardhat as a custom network
		await wallet.addNetwork({
			networkName: "sepolia",
			rpc: "https://sepolia.infura.io/v3/",
			chainId: 11155111,
			symbol: "SepoliaETH",
		});

		await use(context);
	},

	wallet: async ({ context }, use) => {
		const metamask = await dappwright.getWallet("metamask", context);

		await use(metamask);
	},

});

// test.beforeEach(async ({ page }) => {
// 	await page.goto("http://localhost:4173");
// });

test("should be able to connect", async ({ wallet, page }) => {
	// test("should be able to connect", async ({ page }) => {

	// const [wallet, _, context] = await dappwright.bootstrap("", {
	// 	wallet: "metamask",
	// 	version: MetaMaskWallet.recommendedVersion,
	// 	seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
	// 	headless: false,
	// });

	// // Add Hardhat as a custom network
	// await wallet.addNetwork({
	// 	networkName: "sepolia",
	// 	rpc: "https://sepolia.infura.io/v3/",
	// 	chainId: 11155111,
	// 	symbol: "SepoliaETH",
	// });

	await page.goto("http://localhost:4173/metamask");



	// const metamask = await dappwright.getWallet("metamask", context);

	await wallet.switchNetwork('sepolia');


	await page.click("#connect-metamask-button");
	// await wallet.approve();

	// const connectStatus = page.getByTestId("connect-status");
	// expect(connectStatus).toHaveValue("connected");

	// await page.click("#switch-network-button");

	// const networkStatus = page.getByTestId("network-status");
	// expect(networkStatus).toHaveValue("31337");
});

// let sharedPage: Page;

// test.describe.configure({ mode: "serial" });

// test.beforeAll(async ({ page }) => {
// 	sharedPage = page;
// 	await sharedPage.goto("/metamask");
// });

// test.afterAll(async ({ }) => {
// 	await sharedPage.close();
// });

// test('index page has expected h1', async ({ page }) => {
// 	await expect(page.getByRole('heading', { name: 'Test MetaMask Connexion' })).toBeVisible();
// });



/////////////////////////////////////////////////////////
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



// test("connect wallet using default metamask account", async () => {
// 	await sharedPage.click("#connect-metamask-button");
// 	await metamask.acceptAccess();
// 	await expect(sharedPage.locator("#accounts")).toHaveText(
// 		"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
// 	);
// });

// test("import private key and connect wallet using imported metamask account", async () => {
// 	await metamask.disconnectWalletFromAllDapps();
// 	await metamask.importAccount(
// 		"0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97"
// 	);
// 	await sharedPage.click("#connect-metamask-button");
// 	await metamask.acceptAccess();
// 	await expect(sharedPage.locator("#accounts")).toHaveText(
// 		"0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f"
// 	);
// });