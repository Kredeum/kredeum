describe("Kredeum NFTs WP Plugin", () => {
  it("Should load", () => {
    cy.visit("/wp-login.php");
    cy.location("pathname").should("eq", "/wp-login.php");

    cy.get("#user_login").type("wp");
    cy.get("#user_pass").type("wp");
    cy.get("#wp-submit").click();

    cy.location("pathname").should("eq", "/wp-admin/");
    cy.contains("Dashboard");
    cy.contains("NFTs");
  });
});
