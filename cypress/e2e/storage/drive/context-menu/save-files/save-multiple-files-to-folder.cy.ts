describe("Save Multiple Files to Folder via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and save multiple files to a folder", () => {
    // Create test files by drag and drop
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Wait for uploads
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');
    cy.wait('@uploadRequests');

    // Verify files appear in list
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");

    // Select multiple files with cmd/ctrl click
    cy.get("[data-drive-item]").contains("test1.txt").click();
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });

    // Right click to open context menu
    cy.get("[data-drive-item]").contains("test1.txt").rightclick();

    // Click save option
    cy.contains('Save').click();

    // Click the save button
    cy.get('[data-cy="drive-save-button"]').click();

    // Verify the files are in the user drive
    cy.get('[data-cy="open-user-drive-button"]').click();
    cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
    });
  });
});
