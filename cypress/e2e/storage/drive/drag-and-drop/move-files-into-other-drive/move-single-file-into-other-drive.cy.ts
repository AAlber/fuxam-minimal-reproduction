describe("Move Single File from Course Drive to User Drive", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create a file in course drive and drag it into user drive", () => {
    // Create test file by drag and drop in course drive
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");

    // Wait for upload to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequest");
    cy.wait("@uploadRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);

      // Verify file appears in drive
      cy.get("[data-drive-item]").contains("test.txt").should("be.visible");

      // Open user drive
      cy.get('[data-cy="open-user-drive-button"]').click();

      // Get the file element and user drive wrapper
      cy.get("[data-drive-item]").contains("test.txt").as("sourceFile");
      cy.get('[data-drive-instance="user-drive-resizable"]').as("dropTarget");

      // Simulate drag and drop
      cy.get("@sourceFile").trigger("dragstart");
      cy.get("@dropTarget").trigger("dragenter");
      cy.get("@dropTarget").trigger("dragover");
      cy.get("@dropTarget").trigger("drop");
      cy.get("@sourceFile").trigger("dragend");

      // Verify file appears in user drive
      cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
        cy.get("[data-drive-item]").contains("test.txt").should("be.visible");
      });
    });
  });
});
