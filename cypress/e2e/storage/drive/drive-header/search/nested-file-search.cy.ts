describe("Nested File Search", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create nested folder structure", () => {
    // Create top level folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Parent Folder{enter}");

    // Navigate into parent folder

    cy.get("[data-drive-item]").contains("Parent Folder").should("be.visible").dblclick();

    // Create middle folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .wait(300)
      .type("Middle Folder{enter}");

    // Navigate into middle folder  
    cy.get("[data-drive-item]").contains("Middle Folder").dblclick();

    // Create deepest folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible") 
      .wait(300)
      .type("Deep Folder{enter}");

    // Navigate into deep folder
    cy.get("[data-drive-item]").contains("Deep Folder").dblclick();

    // Upload test file in deepest folder
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "nested-test.txt");

    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();
  });

  it("should find folder by name search", () => {
    cy.get('[data-cy="course-drive-search"]').click().type("Middle");
    cy.get("[data-drive-item]").should("have.length", 1);
    cy.get("[data-drive-item]").contains("Middle Folder").should("not.exist");
    cy.get("[data-cy='course-drive-folder-closed-icon-Parent Folder']").click();
    cy.get("[data-drive-item]").contains("Middle Folder").should("be.visible");
  });

  it("should find nested file regardless of folder name", () => {
    cy.get('[data-cy="course-drive-search"] input').clear().type("nested-test");
    cy.get("[data-drive-item]").should("have.length", 2);
    cy.get("[data-drive-item]").contains("nested-test.txt").should("not.exist");
    cy.get("[data-cy='course-drive-folder-closed-icon-Middle Folder']").click();
    cy.get("[data-cy='course-drive-folder-closed-icon-Deep Folder']").click();
    cy.get("[data-drive-item]").contains("nested-test.txt").should("be.visible");
  });

  it("should show all items when search cleared", () => {
    cy.get('[data-cy="course-drive-search"] input').clear();
    
    cy.get("[data-cy='course-drive-home-button']").click();
    //Parent Folder, Middle Folder, Deep Folder, and nested-test.txt since we expanded
    cy.get("[data-drive-item]").should("have.length", 4);
  });
});
