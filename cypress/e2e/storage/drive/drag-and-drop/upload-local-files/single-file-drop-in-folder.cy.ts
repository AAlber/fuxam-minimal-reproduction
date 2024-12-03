describe("File Drop in Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create a folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");
  });

  it("should drop file into folder", () => {
    const testFile = new File(["test content"], "test.txt", { type: "text/plain" });
    
    cy.get("[data-drive-item]").contains("Test Folder").as('folderTarget');
    cy.get('@folderTarget').trigger('dragenter');
    cy.get('@folderTarget').trigger('dragover', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
    cy.get('@folderTarget').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
  });

  it("should show file in folder when opened", () => {
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();
    cy.get("[data-drive-item]").contains("test.txt").should("be.visible");
  });
});
