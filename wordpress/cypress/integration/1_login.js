describe("Kredeum NFTs WP Plugin", () => {
  it("Should login into Dashboard", () => {
    cy.visit("/wp-login.php");
    cy.location("pathname").should("eq", "/wp-login.php");

    cy.get("#user_login").type(Cypress.env("WP_LOGIN"));
    cy.get("#user_pass").type(Cypress.env("WP_PASSWORD"));
    cy.get("#wp-submit").click();

    cy.location("pathname").should("eq", "/wp-admin/");
    cy.get("#wpwrap");
  });
});

// document.body.querySelector("input#plupload-browse-button")
