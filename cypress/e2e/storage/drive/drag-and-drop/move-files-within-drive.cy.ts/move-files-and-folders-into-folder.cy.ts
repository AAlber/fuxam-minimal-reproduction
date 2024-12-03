describe("Move Files and Folders into Folder", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload initial files", () => {
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt",
      "test4.txt"
    ]);
  });

  it("should create source folder and target folder", () => {
    // Create source folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Source Folder{enter}");

    // Create target folder  
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Target Folder{enter}");
  });

  it("should move two files into source folder", () => {
    // Select and drag files into source folder
    cy.get("[data-drive-item]").contains("test1.txt").click();
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });

    cy.get("[data-drive-item]").contains("Source Folder").as('sourceFolder');
    
    cy.get("[data-drive-item]").contains("test1.txt").trigger('dragstart');
    cy.get('@sourceFolder').trigger('dragenter');
    cy.get('@sourceFolder').trigger('dragover');
    cy.get('@sourceFolder').trigger('drop');
  });

  it("should select and drag source folder and two files into target folder", () => {
    // Select source folder and remaining files
    cy.get("[data-drive-item]").contains("Source Folder").click();
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test4.txt").click({ metaKey: true });

    // Get target folder
    cy.get("[data-drive-item]").contains("Target Folder").as('targetFolder');
    
    // Drag selected items
    cy.get("[data-drive-item]").contains("Source Folder").trigger('dragstart');
    cy.get('@targetFolder').trigger('dragenter');
    cy.get('@targetFolder').trigger('dragover');
    cy.get('@targetFolder').trigger('drop');
  });

  it("should show correct items in target folder", () => {
    cy.get("[data-drive-item]").contains("Target Folder").dblclick();
    cy.get("[data-drive-item]").should("have.length", 3);
    cy.get("[data-drive-item]").contains("Source Folder").should("be.visible");
    cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test4.txt").should("be.visible");
  });

  it("should show correct files in source folder within target folder", () => {
    cy.get("[data-drive-item]").contains("Source Folder").dblclick();
    cy.get("[data-drive-item]").should("have.length", 2);
    cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
  });
});
