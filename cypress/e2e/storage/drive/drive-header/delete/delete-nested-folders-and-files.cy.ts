describe("Delete Nested Folders and Files", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create folder with nested content and root file", () => {
    // Create parent folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Parent Folder{enter}");

    // Add file to root level
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "root-file.txt");

    // Navigate into parent folder and create nested content
    cy.get("[data-drive-item]").contains("Parent Folder").dblclick();
    
    // Create nested folder with files
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Nested Folder{enter}");
    
    cy.get("[data-drive-item]").contains("Nested Folder").dblclick();
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', ["nested1.txt", "nested2.txt"]);

    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();
  });

  it("should select and delete nested folder and root file", () => {

    // Expand parent folder
    cy.get("[data-cy='course-drive-folder-closed-icon-Parent Folder']").click();

    // Select nested folder with cmd/ctrl click
    cy.get("[data-drive-item]").contains("Nested Folder").click();

    // Select root file
    cy.get("[data-drive-item]").contains("root-file.txt").click({ metaKey: true });

    // Click delete button
    cy.get("[data-cy='course-drive-delete-button']").click();

    // Verify confirmation dialog appears
    cy.get('[data-cy="confirmation-code-text"]').should('be.visible');
    
    // Get confirmation code text and enter it digit by digit
    cy.get('[data-cy="confirmation-code-text"]').invoke('text').then((code) => {
      // Input each digit into the corresponding slot
      cy.get(`[data-input-otp="true"]`).type(code, {force: true});
    });

    // Click confirm button
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();

    // Verify only parent folder remains
    cy.get("[data-drive-item]").should("have.length", 1);
    cy.get("[data-drive-item]").contains("Parent Folder").should("be.visible");
    cy.get("[data-drive-item]").contains("root-file.txt").should("not.exist");
    cy.get("[data-drive-item]").contains("Nested Folder").should("not.exist");
  });
});
