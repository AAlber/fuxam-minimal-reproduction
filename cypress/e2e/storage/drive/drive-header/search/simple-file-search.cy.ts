describe("File Search", () => {
  before(() => {
    cy.visitCourseDrivePage();
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test.txt",
      "test2.txt",
      "test3.txt",
    ]);
  });
  it("should filter items when searching", () => {
    cy.get('[data-cy="course-drive-search"]').click().type("test");
    cy.get("[data-drive-item]").should("have.length.gte", 3);
  });

  it("should further filter by file extension", () => {
    cy.get('[data-cy="course-drive-search"] input').type(".txt");
    cy.get("[data-drive-item]").should("have.length", 1);
  });

  it("should show correct filtered file", () => {
    cy.get("[data-drive-item]").contains("test.txt").should("exist");
  });

  it("should clear search results", () => {
    cy.get('[data-cy="course-drive-search"] input').clear();
    cy.get("[data-drive-item]").should("have.length.gt", 1);
  });
});
