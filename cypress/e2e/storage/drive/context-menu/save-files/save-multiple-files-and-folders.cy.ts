describe("Save Multiple Files and Folders via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and save multiple files and folders", () => {
    // Create test files by drag and drop
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Wait for uploads
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');
    cy.wait('@uploadRequests');

    // Create second folder with files
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Folder With Files{enter}");

    // Navigate into the second folder
    cy.get("[data-drive-item]").contains("Folder With Files").dblclick();

    // Create files inside the second folder
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "file1.txt",
      "file2.txt"
    ]);

    // Wait for uploads
    cy.wait('@uploadRequests');

    // Navigate back to root
    cy.get('[data-cy="course-drive-home-button"]').click();

    // Verify files and folders appear in list
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("Folder With Files").should("be.visible");

    // Select multiple items with cmd/ctrl click
    cy.get("[data-drive-item]").contains("test1.txt").click();
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("Folder With Files").click({ metaKey: true });

    // Right click to open context menu
    cy.get("[data-drive-item]").contains("test1.txt").rightclick();

    // Click save option
    cy.contains('Save').click();

    // Click the save button
    cy.get('[data-cy="drive-save-button"]').click();

    // Verify the files and folders are in the user drive
    cy.get('[data-cy="open-user-drive-button"]').click();
    cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("Folder With Files").should("be.visible");

      // Verify contents of Folder With Files
      cy.get("[data-drive-item]").contains("Folder With Files").dblclick();
      cy.get("[data-drive-item]").contains("file1.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("file2.txt").should("be.visible");
    });
  });
});
