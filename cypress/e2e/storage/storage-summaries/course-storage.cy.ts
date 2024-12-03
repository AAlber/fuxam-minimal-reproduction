describe("Course Drive Storage Summary", () => {
  beforeEach(() => {
    cy.visitCourseDrivePage();
  });
  it("should show correct storage size after creating content block with files", () => {
    // Intercept PUT requests
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequests");

    // Create test files by drag and drop in course drive
    cy.dragAndDropFiles('[data-drive-instance="course-drive"]', [
      "test1.txt",
      "test2.txt",
      "test3.txt",
    ]);

    // Wait for uploads to complete
    cy.wait("@uploadRequests", { timeout: 30000 });
    cy.wait("@uploadRequests", { timeout: 30000 });
    cy.wait("@uploadRequests", { timeout: 30000 });

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

    // Wait for any upload progress indicators to disappear
    cy.get(`[data-cy="course-drive-upload-progress"]`).should("not.exist", {
      timeout: 30000,
    });

    // Simulate drag and drop of selected files
    cy.get("[data-drive-item]").contains("test1.txt").trigger("dragstart");
    cy.get("@dropTarget").trigger("dragenter");
    cy.get("@dropTarget").trigger("dragover");
    cy.get("@dropTarget").trigger("drop");
    cy.get("[data-drive-item]").contains("test1.txt").trigger("dragend");

    // Verify files appear in uppy dashboard
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons")
      .contains("test1.txt")
      .should("be.visible");
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons")
      .contains("test2.txt")
      .should("be.visible");
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons")
      .contains("test3.txt")
      .should("be.visible");

    // Fill in the name and description
    cy.get("[data-cy='content-block-name-input']").type("Test Content Block");

    // Click create content block button
    cy.get('[data-cy="content-block-create-button"]').click();


    cy.wait("@uploadRequests", { timeout: 30000 });
    cy.wait("@uploadRequests", { timeout: 30000 });
    cy.wait("@uploadRequests", { timeout: 30000 });

    // Navigate to settings and verify storage size
    cy.visit(`/dashboard/course/${Cypress.env("layerId")}/settings`);
    cy.url().should(
      "include",
      `/dashboard/course/${Cypress.env("layerId")}/settings`,
    );

    // Verify total size (76B for 6 course files in total)
    cy.get("[data-cy='course-storage-summary']").should("contain", "72 B");
  });
});
