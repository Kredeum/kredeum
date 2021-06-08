describe("Kredeum NFTs DAPP", () => {
  it("Should load", () => {
    cy.visit("/kredeum/");

    cy.location("pathname").should("eq", "/kredeum/");
    cy.contains("Kredeum NFTs");
  });
});
