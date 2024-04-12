import { test, expect } from "./lib/fixtures";
import { metamask } from "./lib/synthetixio";

test.only("mint one NFT", async ({ page }) => {
  await page.goto("/");
  await page.click("#metamaskConnect");
  await metamask.acceptAccess();

  await page.locator("#addPopup").click();

  await expect(page.locator("#mintPopup")).toContainText("Mint NFT");
  await page.locator("#mintPopup").click();

  await expect(page.locator("#mintNft")).toContainText("Mint NFT");

  await page.locator('input[name="file"]').click();
  await page.locator('input[name="file"]').setInputFiles("./tests/assets/klogo.png");

  await page.locator("#mintNft").click();
  await page.screenshot({ path: "./test-results/screenshot.png" });
  await page.pause();
  await metamask.confirmTransaction();
});
