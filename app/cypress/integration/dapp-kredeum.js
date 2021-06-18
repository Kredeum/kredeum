describe("Kredeum NFTs DAPP", () => {
  it("Should load", () => {
    cy.visit("/app/");

    cy.location("pathname").should("eq", "/app/");

    cy.contains("Kredeum NFTs");
    cy.contains("Kredeum NFTs", { includeShadowDom: true });
    cy.get("kredeum-nft").shadow().contains("Kredeum NFTs");
  });
});
