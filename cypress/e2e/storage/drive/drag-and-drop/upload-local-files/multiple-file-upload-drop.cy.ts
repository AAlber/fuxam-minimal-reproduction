describe("Multiple File Upload and Drag/Drop", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should allow multiple file drag and drop", () => {
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', ["test1.txt", "test2.txt", "test3.txt"]);
  });

  it("should show correct number of items", () => {
    cy.get('[data-drive-instance="course-drive"]').within(() => {
      cy.get("[data-drive-item]").should("have.length", 3);
    });
  });
});
