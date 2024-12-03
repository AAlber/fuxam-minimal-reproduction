describe("Delete Multiple Folders", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create folders with nested content", () => {
    // Create first folder and add files
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Folder 1{enter}");

    cy.get("[data-drive-item]").contains("Folder 1").dblclick();
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', ["test1.txt", "test2.txt"]);
    
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

    // Create second folder with files
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Folder 2{enter}");

    cy.get("[data-drive-item]").contains("Folder 2").dblclick();
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', ["test3.txt", "test4.txt"]);

    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();
  });

  it("should select multiple folders and delete them", () => {
    // Select folders with cmd/ctrl click
    cy.get("[data-drive-item]").contains("Folder 1").click();
    cy.get("[data-drive-item]").contains("Folder 2").click({ metaKey: true });

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

    // Verify folders and all contents are deleted
    cy.get("[data-drive-item]").should("not.exist");
  });
});
