const { update_slot_spread } = require("svelte/internal");

describe("Test upload image", function () {
  it("Should upload Image from file", () => {
    // Login
    cy.login();

    // Upload image
    cy.visit("/wp-admin/media-new.php?browser-uploader");

    cy.get('input[type="file"]').attachFile("klogo.png");
    cy.wait(5000);
    cy.get("#html-upload").click();
    cy.location("pathname").should("eq", "/wp-admin/upload.php");
    // cy.get("img.pinkynail", { timeout: 60000 });
    // cy.visit("/wp-admin/upload.php");

    // Verify IPFS link
    cy.get("#the-list tr:first td.kre-cid a")
      .invoke("attr", "href")
      .should("eq", "https://ipfs.io/ipfs/bafkreia756ojs2x7ld7m6jjlz7djojgonh4sgnqotxsiorhux3az6v45ly");

    // Delete Media just created
    cy.get("#the-list tr:first td.column-title div.row-actions span.delete a").click({ force: true });
    cy.on("window:confirm", () => true);
  });
});
