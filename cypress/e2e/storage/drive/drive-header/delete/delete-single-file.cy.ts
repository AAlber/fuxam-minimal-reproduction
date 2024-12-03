describe("Delete Single File", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload initial file", () => {
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");
  });

  it("should select file and delete it", () => {
    // Select the file
    cy.get("[data-drive-item]").contains("test.txt").click();

    // Click delete button
    cy.get("[data-cy='course-drive-delete-button']").click();

    // Click confirm button
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();

    // Verify file is deleted
    cy.get("[data-drive-item]").should("not.exist");
  });
});
