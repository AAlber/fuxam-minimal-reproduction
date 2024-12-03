describe("Arrow Navigation Between Folders", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create folders with nested structure", () => {
    // Create first folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Folder 1{enter}");

    // Navigate into first folder and create nested folder
    cy.get("[data-drive-item]").contains("Folder 1").dblclick();
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Nested Folder 1{enter}");

    // Navigate into nested folder and create sub-nested folder
    cy.get("[data-drive-item]").contains("Nested Folder 1").dblclick();
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Sub-Nested Folder{enter}");

    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();

    // Create second folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Folder 2{enter}");
  });

  it("should navigate forward through folders using arrows", () => {
    // Navigate into first folder
    cy.get("[data-drive-item]").contains("Folder 1").dblclick();
    
    // Navigate into nested folder
    cy.get("[data-drive-item]").contains("Nested Folder 1").dblclick();
    
    // Navigate into sub-nested folder
    cy.get("[data-drive-item]").contains("Sub-Nested Folder").dblclick();
  });

  it("should navigate backward through folders using arrows", () => {
    // Navigate back to nested folder
    cy.get("[data-cy='course-drive-back-button']").click();
    cy.get("[data-drive-item]").contains("Sub-Nested Folder").should("be.visible");
    
    // Navigate back to first folder
    cy.get("[data-cy='course-drive-back-button']").click();
    cy.get("[data-drive-item]").contains("Nested Folder 1").should("be.visible");
    
    // Navigate back to root
    cy.get("[data-cy='course-drive-back-button']").click();
    cy.get("[data-drive-item]").contains("Folder 1").should("be.visible");
    cy.get("[data-drive-item]").contains("Folder 2").should("be.visible");
  });

  it("should navigate forward again using forward arrow", () => {
    // Navigate forward to first folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    cy.get("[data-drive-item]").contains("Nested Folder 1").should("be.visible");
    
    // Navigate forward to nested folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    cy.get("[data-drive-item]").contains("Sub-Nested Folder").should("be.visible");
    
    // Navigate forward to sub-nested folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    
    // Verify forward button is disabled at deepest level
    cy.get("[data-cy='course-drive-forward-button']").should("be.disabled");
  });

  it("should navigate back to deeply nested folder after using home button", () => {
    // Start in sub-nested folder (from previous test)
    
    // Click home button
    cy.get("[data-cy='course-drive-home-button']").click();
    cy.get("[data-drive-item]").contains("Folder 1").should("be.visible");
    cy.get("[data-drive-item]").contains("Folder 2").should("be.visible");
    
    // Navigate forward to first folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    cy.get("[data-drive-item]").contains("Nested Folder 1").should("be.visible");
    
    // Navigate forward to nested folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    cy.get("[data-drive-item]").contains("Sub-Nested Folder").should("be.visible");
    
    // Navigate forward to sub-nested folder
    cy.get("[data-cy='course-drive-forward-button']").click();
    
    // Verify we're in the deepest level
    cy.get("[data-cy='course-drive-forward-button']").should("be.disabled");
  });
});
