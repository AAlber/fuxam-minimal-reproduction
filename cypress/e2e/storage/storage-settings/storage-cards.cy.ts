/// <reference types="cypress" />

describe("Purchase Storage", () => {
  beforeEach(() => {
    cy.visit("/en/dashboard/settings/usage");
  });

  it("should show correct trial storage and update additional storage", () => {
    // Check trial subscription bonus is 1GB
    cy.get('[data-cy="trial-storage-card"]')
      .should('be.visible')
      .and('contain', '1GB');

    // Input 4 into purchase storage quantity input
    cy.get('[data-cy="purchase-storage-quantity-input"]')
      .clear()
      .type('4');

    // Check that additional storage quantity is updated to 100GB
    cy.get('[data-cy="additional-storage-quantity"]')
      .should('contain', '100GB');
  });
});
