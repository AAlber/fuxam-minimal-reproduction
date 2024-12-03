describe("Rename Folder via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create folder structure and rename parent folder", () => {
    // Create parent folder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");

    // Navigate into folder
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();

    // Create files and drag them into parent folder
    cy.dragAndDropFiles(
      '[data-cy="course-drive-upload-button"]',
      ['test1.txt', 'test2.txt']
    );

    // Wait for uploads
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');
    cy.wait('@uploadRequests');

    // Create subfolder
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Subfolder{enter}");

    // Navigate into subfolder
    cy.get("[data-drive-item]").contains("Subfolder").dblclick();

    // Drag file into subfolder
    cy.dragAndDropFile(
      '[data-cy="course-drive-upload-button"]',
      'subfile.txt'
    );

    // Wait for upload
    cy.wait('@uploadRequests');

    // Navigate back to root
    cy.get("[data-cy='course-drive-home-button']").click();

    // Right click parent folder and rename
    cy.get("[data-drive-item]").contains("Test Folder").rightclick();
    cy.contains('Rename').click();
    cy.get("[data-cy='course-drive-rename-input']")
      .should('be.visible')
      .wait(300)
      .type('Renamed Folder{enter}');

    // Verify folder was renamed
    cy.get("[data-drive-item]").contains("Renamed Folder").should('be.visible');

    // Navigate into renamed folder and verify contents
    cy.get("[data-drive-item]").contains("Renamed Folder").dblclick();
    cy.get("[data-drive-item]").contains("test1.txt").should('be.visible');
    cy.get("[data-drive-item]").contains("test2.txt").should('be.visible');
    cy.get("[data-drive-item]").contains("Subfolder").should('be.visible');

    // Check subfolder contents
    cy.get("[data-drive-item]").contains("Subfolder").dblclick();
    cy.get("[data-drive-item]").contains("subfile.txt").should('be.visible');
  });
});
