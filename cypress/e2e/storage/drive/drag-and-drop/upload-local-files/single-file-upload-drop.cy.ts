describe("File Upload and Drag/Drop", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });
  it("should return to root folder", () => {
    cy.get("[data-cy='course-drive-home-button']").click();
  });

  it("should allow file drag and drop", () => {
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");
  });

  it("should show correct number of items", () => {
    cy.get('[data-drive-instance="course-drive"]').within(() => {
      cy.get("[data-drive-item]").should("have.length", 1);
    });
  });

  
});