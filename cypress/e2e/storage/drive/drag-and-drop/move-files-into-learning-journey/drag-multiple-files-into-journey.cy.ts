describe("Drag Multiple Files from Course Drive into Learning Journey", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create multiple files in course drive and drag them into learning journey", () => {
    // Create test files by drag and drop in course drive
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', ["test1.txt", "test2.txt", "test3.txt"]);

    // Wait for uploads to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequests");
    cy.wait("@uploadRequests").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);

      // Verify files appear in drive
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
      cy.get("[data-drive-item]").contains("test2.txt").should("be.visible"); 
      cy.get("[data-drive-item]").contains("test3.txt").should("be.visible");

      // Select multiple files with cmd/ctrl click
      cy.get("[data-drive-item]").contains("test1.txt").click();
      cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
      cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });

      // Get the learning journey wrapper
      cy.get("[data-cy='learning-journey-wrapper']").as("dropTarget");

      // Simulate drag and drop of selected files
      cy.get("[data-drive-item]").contains("test1.txt").trigger("dragstart");
      cy.get("@dropTarget").trigger("dragenter");
      cy.get("@dropTarget").trigger("dragover");
      cy.get("@dropTarget").trigger("drop");
      cy.get("[data-drive-item]").contains("test1.txt").trigger("dragend");

      // Verify toast appears indicating success for each file
      cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test1.txt").should("be.visible");
      cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test2.txt").should("be.visible");
      cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test3.txt").should("be.visible");
    });
  });
});
