describe("Kredeum NFTs DAPP", () => {
  it("Should load", () => {
    cy.visit("/app/");

    cy.location("pathname").should("eq", "/app/");

    cy.contains("My NFTs");
    cy.contains("My NFTs", { includeShadowDom: true });
    cy.get("kredeum-nft").shadow().contains("My NFTs");
  });
});
