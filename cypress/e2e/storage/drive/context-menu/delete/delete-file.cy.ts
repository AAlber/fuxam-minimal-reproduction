describe("Delete File via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and delete a file using context menu", () => {
    // Create test file by drag and drop
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");

    // Wait for upload to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequest");
    cy.wait("@uploadRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);

      // Verify file appears in drive
      cy.get("[data-drive-item]").contains("test.txt").should("be.visible");

      // Right click on file to open context menu  
      cy.get("[data-drive-item]").contains("test.txt").rightclick();
      
      // Click delete option
      cy.contains('Delete').click()

      // Click confirm button
      cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();

      // Verify file is removed
      cy.get("[data-drive-item]").should('not.exist');
    });
  });
});
