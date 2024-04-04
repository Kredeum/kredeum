import type { PlaywrightTestConfig } from '@playwright/test';
import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';


const config: PlaywrightTestConfig = {
	workers: 1,
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		// url: "http://localhost:4173",
		// reuseExistingServer: true,
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	outputDir: "test-results",
	use: {
		// Configurez le navigateur pour qu'il ne soit pas en mode headless
		headless: false,
	},
	// projects: [
	// 	{
	// 		name: 'dAppwright',
	// 		use: {
	// 			context: async ({ }, use) => {
	// 				// Launch context with extension
	// 				const [wallet, _, context] = await dappwright.bootstrap("", {
	// 					wallet: "metamask",
	// 					version: MetaMaskWallet.recommendedVersion,
	// 					seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
	// 					headless: false,
	// 				});

	// 				// Add Hardhat as a custom network
	// 				await wallet.addNetwork({
	// 					networkName: "sepolia",
	// 					rpc: "https://sepolia.infura.io/v3/",
	// 					chainId: 11155111,
	// 					symbol: "SepoliaETH",
	// 				});

	// 				await use(context);
	// 			},

	// 			wallet: async ({ context }, use) => {
	// 				const metamask = await dappwright.getWallet("metamask", context);

	// 				await use(metamask);
	// 			},
	// 		}
	// 	}
	// ]
};

export default config;
