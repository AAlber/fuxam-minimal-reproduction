describe("Download File via Context Menu", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should create and download a file using context menu", () => {
    // Create test file by drag and drop
    cy.dragAndDropFile('[data-drive-instance="course-drive"]', "test.txt");

    // Wait for upload to complete
    cy.intercept("PUT", `${Cypress.env("s3_api")}/**`).as("uploadRequest");
    cy.wait("@uploadRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);

      // Verify file appears in drive
      cy.get("[data-drive-item]").contains("test.txt").should("be.visible");

      // Intercept download request
      cy.intercept('GET', `${Cypress.env('s3_api')}/**`).as('downloadRequest');
      
      // Right click on file to open context menu
      cy.get("[data-drive-item]").contains("test.txt").rightclick();
      
      // Click download option
      cy.contains('Download').click();
      
      // Verify the download request was successful
      cy.wait('@downloadRequest').then((interception) => {
        expect(interception.request.url).to.include(Cypress.env('s3_api'));
        expect(interception.response?.statusCode).to.be.oneOf([200, 206]); // 206 is for partial content
      });
    });
  });
});
