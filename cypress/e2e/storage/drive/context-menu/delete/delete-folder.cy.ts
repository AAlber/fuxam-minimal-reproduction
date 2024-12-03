describe("Delete Folder via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and delete a folder using context menu", () => {
    // Create folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");

    // Verify folder appears in list
    cy.get("[data-drive-item]").contains("Test Folder").should("be.visible");

    // Right click on folder to open context menu  
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

    // Verify folder is removed
    cy.get("[data-drive-item]").should('not.exist');
  });
});
