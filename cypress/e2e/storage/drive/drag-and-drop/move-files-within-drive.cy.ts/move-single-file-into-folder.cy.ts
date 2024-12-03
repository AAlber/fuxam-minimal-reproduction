describe("Move Single File into Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload initial file", () => {
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");
  });

  it("should create a folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");
  });

  it("should drag file into folder", () => {
    cy.get("[data-drive-item]").contains("test.txt").as('fileSource');
    cy.get("[data-drive-item]").contains("Test Folder").as('folderTarget');
    
    cy.get('@fileSource').trigger('dragstart');
    cy.get('@folderTarget').trigger('dragenter');
    cy.get('@folderTarget').trigger('dragover');
    cy.get('@folderTarget').trigger('drop');
  });

  it("should show file in folder when opened", () => {
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();
    cy.get("[data-drive-item]").contains("test.txt").should("be.visible");
  });
});
