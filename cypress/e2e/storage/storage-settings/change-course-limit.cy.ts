/// <reference types="cypress" />

describe("Change course storage limit", () => {
  beforeEach(() => {
    cy.visit("/en/dashboard/settings/usage");
  });

  it("should update course storage limit and persist after refresh", () => {
    // Change storage limit to 10
    cy.get('[data-cy="course-storage-limit-input"]')
      .clear()
      .type("10");


    cy.intercept('POST', `/en/dashboard/settings/usage**`).as('updateSettings');
    // Click save button
    cy.get('[data-cy="settings-section-footer-button"]').first().click();
    cy.wait('@updateSettings', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Refresh page
    cy.reload();

    // Verify input value is still 10
    cy.get('[data-cy="course-storage-limit-input"]')
      .should("have.value", "10");
  });
});
