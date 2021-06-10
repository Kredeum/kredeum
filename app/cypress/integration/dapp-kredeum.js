describe("Kredeum NFTs DAPP", () => {
  it("Should load", () => {
    cy.visit("/kredeum/");

    cy.location("pathname").should("eq", "/kredeum/");

    cy.contains("Kredeum NFTs");
    cy.contains("Kredeum NFTs", { includeShadowDom: true });
    cy.get("kredeum-nft").shadow().contains("Kredeum NFTs");
  });
});
