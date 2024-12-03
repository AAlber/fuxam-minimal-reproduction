describe("Save Single File via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and save a file", () => {
    // Create test file by drag and drop
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt"
    ]);

    // Wait for upload
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequest');
    cy.wait('@uploadRequest');

    // Verify file appears in list
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");

    // Right click to open context menu
    cy.get("[data-drive-item]").contains("test1.txt").rightclick();

    // Click save option
    cy.contains('Save').click();

    // Click the save button
    cy.get('[data-cy="drive-save-button"]').click();

    // Verify the file is in the user drive
    cy.get('[data-cy="open-user-drive-button"]').click();
    cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    });
  });
});
