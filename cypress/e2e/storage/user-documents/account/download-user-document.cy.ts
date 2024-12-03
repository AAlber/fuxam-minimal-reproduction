describe("Download user document from account page", () => {
  beforeEach(() => {
    cy.visit("/en/dashboard/account/overview");
  });

  it("should download uploaded document successfully", () => {
    // Click upload button
    cy.get('[data-cy="account-upload-user-documents-button"]').click();

    // Create test file
    const testFile = new File(['{"test": "data"}'], 'test_doc.json', { type: 'application/json' });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequest');

    // Upload file via input
    cy.get('.uppy-Dashboard-input').first().selectFile(
      [{ contents: testFile, fileName: 'test_doc.json' }],
      { force: true }
    );

    // Verify upload button is visible and click it
    cy.get('[data-cy="file-drop-field-upload-button"]').should('be.visible').click();

    // Wait for upload to complete
    cy.wait('@uploadRequest', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify file appears in list
    cy.contains('test_doc.json').should('exist');

    // Click the document item to download
    cy.get('[data-cy="account-user-document-item"]').click();

    // Verify download was initiated
    cy.readFile('cypress/downloads/test_doc.json').should('exist');
  });
});
