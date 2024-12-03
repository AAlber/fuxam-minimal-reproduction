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
      .type('5');

    // Check subtotal is 100€ (20€ x 5 packages)
    cy.get('[data-cy="purchase-storage-subtotal"]')
      .should('contain', '€100.00');

    // Check tax is 19€ (19% of 100€)
    cy.get('[data-cy="purchase-storage-tax"]')
      .should('contain', '€19.00');

    // Check total is 119€ (subtotal + tax)
    cy.get('[data-cy="purchase-storage-total"]')
      .should('contain', '€119.00');
    
      cy.intercept('POST', `/en/dashboard/settings/usage**`).as('purchaseStorage');
      // Click save button
      cy.get('[data-cy="settings-section-footer-button"]').eq(1).click();
      cy.wait('@purchaseStorage', { timeout: 30000 }).then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
      });

  });

});