describe("Move Files and Folder out of Nested Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create parent folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Parent Folder{enter}");
  });

  it("should create nested folder and add files", () => {
    // Navigate into parent folder
    cy.get("[data-drive-item]").contains("Parent Folder").dblclick();

    // Create nested folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Nested Folder{enter}");

    // Navigate into nested folder
    cy.get("[data-drive-item]").contains("Nested Folder").dblclick();

    // Add two files to nested folder
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "nested-file1.txt",
      "nested-file2.txt"
    ]);

    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();
  });

  it("should move all contents out of parent folder to root", () => {
    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();

    // Expand the Parent Folder
    cy.get("[data-cy='course-drive-folder-closed-icon-Parent Folder']").click();

    // Select all items in Parent Folder
    cy.get("[data-drive-item]").contains("Nested Folder").trigger('dragstart');
    cy.get('[data-drive-instance="course-drive"]').trigger('dragenter');
    cy.get('[data-drive-instance="course-drive"]').trigger('dragover');
    cy.get('[data-drive-instance="course-drive"]').trigger('drop');

    // Verify items are now at root level
    cy.get("[data-drive-item]").should("have.length", 2);
    cy.get("[data-drive-item]").contains("Nested Folder").should("be.visible");
    cy.get("[data-drive-item]").contains("Parent Folder").should("be.visible");
  });
});
