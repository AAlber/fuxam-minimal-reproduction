describe("Move Multiple Files into Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload initial files", () => {
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);
  });

  it("should create a folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");
  });

  it("should select and drag multiple files into folder", () => {
    // Select multiple files with cmd/ctrl click
    cy.get("[data-drive-item]").contains("test1.txt").click();
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });

    // Get folder target
    cy.get("[data-drive-item]").contains("Test Folder").as('folderTarget');
    
    // Drag first selected file (others will follow)
    cy.get("[data-drive-item]").contains("test1.txt").trigger('dragstart');
    cy.get('@folderTarget').trigger('dragenter');
    cy.get('@folderTarget').trigger('dragover');
    cy.get('@folderTarget').trigger('drop');
  });

  it("should show all files in folder when opened", () => {
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();
    cy.get("[data-drive-item]").should("have.length", 3);
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
  });
});
