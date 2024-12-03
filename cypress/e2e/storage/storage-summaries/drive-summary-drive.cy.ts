
describe("Course Drive Storage Summary", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should show correct folder sizes when adding files", () => {
    // Intercept PUT requests
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Create root level folders
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .wait(300)
      .type("Folder 1{enter}");

    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .wait(300)
      .type("Folder 2{enter}");

    // Add files to Folder 1
    cy.get("[data-drive-item]").contains("Folder 1").dblclick();
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);
    cy.wait('@uploadRequests', { timeout: 30000 });
    cy.wait('@uploadRequests', { timeout: 30000 });
    cy.wait('@uploadRequests', { timeout: 30000 });

    // Create subfolder in Folder 1
    cy.get("[data-cy='course-drive-new-folder-button']").click();
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .wait(300)
      .should("be.focused") 
      .type("Subfolder 1{enter}");
    
    cy.get("[data-drive-item]").contains("Subfolder 1").dblclick();

    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "subtest1.txt",
      "subtest2.txt"
    ]);
    
    // Return to root
    cy.get("[data-cy='course-drive-home-button']").click();

    // Expand Folder 1 by clicking folder icon
    cy.get('[data-cy="course-drive-folder-closed-icon-Folder 1"]').click();

    // Expand Subfolder 1 by clicking folder icon
    cy.get('[data-cy="course-drive-folder-closed-icon-Subfolder 1"]').click();

    cy.wait('@uploadRequests', { timeout: 30000 });
    cy.wait('@uploadRequests', { timeout: 30000 });
    
    // Verify Subfolder 1 size (2 files = 24 bytes)
    cy.get(`[data-cy="drive-item-size-Subfolder 1"]`)
      .should("contain", "24 B");
    
    cy.wait(20000);
    cy.get(`[data-cy="course-drive-upload-progress"]`).should("not.exist", { timeout: 30000 });
    // Verify Folder 1 size (3 direct files + 2 subfolder files = 60 bytes)
    cy.get(`[data-cy="drive-item-size-Folder 1"]`)
      .should("contain", "60 B");
  });

  it("should show correct folder sizes when going to course settings", () => {
    cy.visit(`/dashboard/course/${Cypress.env("layerId")}/settings`);
    cy.url().should("include", `/dashboard/course/${Cypress.env("layerId")}/settings`);
    //60B for the files + 15B for the 3 subfolders
    cy.get("[data-cy='course-storage-summary']")
      .should("contain", "75 B");
  });
});

