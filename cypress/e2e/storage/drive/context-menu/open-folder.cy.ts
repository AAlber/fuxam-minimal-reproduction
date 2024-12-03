describe("Open Folder via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and open a folder using context menu", () => {
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
    
    // Click open option
    cy.get('[data-cy="course-drive-open-button"]').click();
    // Verify we're inside the folder by checking breadcrumb
    cy.get('[data-cy="course-drive-breadcrumb-Test Folder"]').should("be.visible");
  });
});
