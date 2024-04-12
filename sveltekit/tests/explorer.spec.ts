import { expect, test } from "@playwright/test";

test("explore one NFT", async ({ page }) => {
  await page.goto("/#/11155111/0x8354Ef7b78012151c276f51F8d19147FF8C47288/6");
  await expect(page.locator("#nftTokenID")).toContainText("#6");
  await expect(page.locator("#nftName")).toContainText("kredeum");
  await expect(page.locator("#nftDescription")).toContainText("kredeum");
});
