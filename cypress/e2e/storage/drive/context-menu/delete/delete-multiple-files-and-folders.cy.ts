describe("Delete Multiple Files and Folders via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create test files and folders then delete them together", () => {
    // Create parent folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");

    // Create test files by drag and drop
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Wait for uploads
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');
    cy.wait('@uploadRequests');

    // Select multiple items with cmd/ctrl click
    cy.get("[data-drive-item]").contains("Test Folder").click();
    cy.get("[data-drive-item]").contains("test1.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });

    // Right click on any selected item to open context menu
    cy.get("[data-drive-item]").contains("Test Folder").rightclick();
    
    // Click delete option
    cy.contains('Delete').click();
    
    // Verify confirmation dialog appears
    cy.get('[data-cy="confirmation-code-text"]').should('be.visible');
    
    // Get confirmation code text and enter it digit by digit
    cy.get('[data-cy="confirmation-code-text"]').invoke('text').then((code) => {
      // Input each digit into the corresponding slot
      cy.get(`[data-input-otp="true"]`).type(code, {force: true});
    });

    // Click confirm button
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();

    // Verify all items are removed
    cy.get("[data-drive-item]").should('not.exist');
  });
});
