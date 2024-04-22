import { test, expect } from "./lib/fixtures";
import { metamask } from "./lib/synthetixio";

test("connect wallet using default metamask account", async ({ page }) => {
  await page.goto("/");
  await page.click("#metamaskConnect");
  await metamask.acceptAccess();

  await expect(page.locator("#metamaskAccount")).toContainText("0x0123");
});
