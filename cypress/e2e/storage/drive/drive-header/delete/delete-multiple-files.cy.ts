describe("Delete Multiple Files", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload initial files", () => {
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt"
    ]);
  });

  it("should select multiple files and delete them", () => {
    // Select multiple files with cmd/ctrl click
    cy.get("[data-drive-item]").contains("test1.txt").click();
    cy.get("[data-drive-item]").contains("test2.txt").click({ metaKey: true });
    cy.get("[data-drive-item]").contains("test3.txt").click({ metaKey: true });

    // Click delete button
    cy.get("[data-cy='course-drive-delete-button']").click();

    // Verify confirmation dialog appears
    cy.get('[data-cy="confirmation-code-text"]').should('be.visible');
    
    // Get confirmation code text and enter it digit by digit
    cy.get('[data-cy="confirmation-code-text"]').invoke('text').then((code) => {
      // Input each digit into the corresponding slot
      cy.get(`[data-input-otp="true"]`).type(code, {force: true});
    });

    // Click confirm button
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();

    // Verify files are deleted
    cy.get("[data-drive-item]").should("not.exist");
  });
});
