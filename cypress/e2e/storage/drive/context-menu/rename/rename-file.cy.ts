describe("Rename File via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and rename a file using context menu", () => {
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");

    // Wait for upload to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequest");
    cy.wait("@uploadRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    
      cy.wait(2000)
      // Verify file appears in drive
      cy.get("[data-drive-item]").contains("test.txt").should("be.visible");

      // Right click on file to open context menu
      cy.get("[data-drive-item]").contains("test.txt").rightclick();

      // Click rename option
      cy.contains("Rename").click();

      // Verify rename input appears and can be edited
      cy.get("[data-cy='course-drive-rename-input']")
        .should("be.visible")
        .wait(300)
        .type("renamed-file{enter}");

      // Verify file was renamed
      cy.get("[data-drive-item]")
        .contains("renamed-file.txt")
        .should("be.visible");
    });
  });
});
