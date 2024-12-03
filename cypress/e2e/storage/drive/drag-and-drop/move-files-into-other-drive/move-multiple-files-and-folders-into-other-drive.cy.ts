describe("Move Multiple Files and Folders from Course Drive to User Drive", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create multiple files and folders in course drive and drag them into user drive", () => {
    // Create test files by drag and drop in course drive
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);

    // Create a folder
    cy.get('[data-cy="course-drive-new-folder-button"]').click();
    cy.get('[data-cy="course-drive-rename-input"]').wait(300).type("TestFolder{enter}");

    // Create a file inside the folder
    cy.get("[data-drive-item]").contains("TestFolder").dblclick();
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "insideFolder.txt");
    // Return to home folder
    cy.get('[data-cy="course-drive-home-button"]').click();
    // Wait for uploads to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequests");
    cy.wait("@uploadRequests").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);

      // Click the folder closed icon to expand folder
      cy.get('[data-cy="course-drive-folder-closed-icon-TestFolder"]').click();

      // Verify files and folder appear in drive
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("TestFolder").should("be.visible");

      // Open user drive
      cy.get('[data-cy="open-user-drive-button"]').click();

      // Select multiple files and folder with cmd/ctrl click
      cy.get("[data-drive-item]").contains("test1.txt").click();
      cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
      cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });
      cy.get("[data-drive-item]").contains("TestFolder").click({ metaKey: true });

      // Get the user drive wrapper
      cy.get('[data-drive-instance="user-drive-resizable"]').as("dropTarget");

      // Simulate drag and drop of selected files and folder
      cy.get("[data-drive-item]").contains("test1.txt").trigger("dragstart");
      cy.get("@dropTarget").trigger("dragenter");
      cy.get("@dropTarget").trigger("dragover");
      cy.get("@dropTarget").trigger("drop");
      cy.get("[data-drive-item]").contains("test1.txt").trigger("dragend");

      // Verify files and folder appear in user drive
      cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
        cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
        cy.get("[data-drive-item]").contains("test2.txt").should("be.visible");
        cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");
        cy.get("[data-drive-item]").contains("TestFolder").should("be.visible");

        // Verify file inside the folder
        cy.get("[data-drive-item]").contains("TestFolder").dblclick();
        cy.get("[data-drive-item]").contains("insideFolder.txt").should("be.visible");
      });
    });
  });
});
