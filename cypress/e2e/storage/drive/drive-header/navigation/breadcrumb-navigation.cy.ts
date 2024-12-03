describe("Folder Creation and Navigation", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create new folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");
    
    cy.get("[data-drive-item]").contains("Test Folder").should("be.visible");
  });

  it("should navigate into folder", () => {
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();
    cy.get('[data-cy="course-drive-breadcrumb-Test Folder"]').should("be.visible");
  });

  it("should create nested folder", () => {
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Nested Folder{enter}");
    
    cy.get("[data-drive-item]").contains("Nested Folder").should("be.visible");
  });

  it("should navigate into nested folder", () => {
    cy.get("[data-drive-item]").contains("Nested Folder").dblclick();
    cy.get('[data-cy="course-drive-breadcrumb-Nested Folder"]').should("be.visible");
  });

  it("should navigate back to parent folder", () => {
    cy.get('[data-cy="course-drive-breadcrumb-Test Folder"]').click();
    cy.get('[data-cy="course-drive-breadcrumb-Test Folder"]').should("be.visible");
    cy.get("[data-drive-item]").contains("Nested Folder").should("be.visible");
  });

  it("should navigate to root", () => {
    cy.get('[data-cy="course-drive-home-button"]').click();
    cy.get("[data-drive-item]").contains("Test Folder").should("be.visible");
  });
});