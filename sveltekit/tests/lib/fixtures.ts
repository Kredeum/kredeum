import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { metamask, playwright, synpress, helpers } from "./synthetixio";

export const test = base.extend<{
  context: BrowserContext;
}>({
  context: async ({}, use) => {
    // required for synpress as it shares same expect instance as playwright
    await playwright.setExpectInstance(expect);

    // download metamask
    const metamaskPath = await helpers.prepareMetamask(process.env.METAMASK_VERSION || "10.25.0");

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222"
    ];

    if (process.env.CI) {
      browserArgs.push("--disable-gpu");
    }

    if (process.env.HEADLESS_MODE) {
      browserArgs.push("--headless=new");
    }

    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs
    });

    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);

    // setup metamask
    await metamask.initialSetup(chromium, {
      secretWordsOrPrivateKey:
        process.env.METAMASK_PRIVATE_KEY || "test test test test test test test test test test test junk",
      network: "sepolia",
      password: "test@kredeum",
      enableAdvancedSettings: true
    });

    await use(context);

    await context.close();

    await synpress.resetState();
  }
});

export const expect = test.expect;
