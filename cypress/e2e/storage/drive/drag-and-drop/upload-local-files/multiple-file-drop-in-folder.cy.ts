describe("Multiple File Drop in Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create a folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000}).wait(300)
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");
  });

  it("should drop multiple files into folder", () => {
    const testFiles = [
      new File(["test content 1"], "test1.txt", { type: "text/plain" }),
      new File(["test content 2"], "test2.txt", { type: "text/plain" }),
      new File(["test content 3"], "test3.txt", { type: "text/plain" })
    ];
    
    cy.get("[data-drive-item]").contains("Test Folder").as('folderTarget');
    cy.get('@folderTarget').trigger('dragenter');
    cy.get('@folderTarget').trigger('dragover', {
      dataTransfer: {
        files: testFiles,
        types: ['Files'],
      },
    });
    cy.get('@folderTarget').trigger('drop', {
      dataTransfer: {
        files: testFiles,
        types: ['Files'],
      },
    });
  });

  it("should show all files in folder when opened", () => {
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();
    cy.get("[data-drive-item]").should("have.length", 3);
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test2.txt").should("be.visible"); 
    cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
  });
});
