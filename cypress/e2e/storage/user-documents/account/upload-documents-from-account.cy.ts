/// <reference types="cypress" />

describe("Upload documents from account page", () => {
  beforeEach(() => {
    cy.visit("/en/dashboard/account/overview");
  });

  it("should upload documents successfully", () => {
    // Click upload button
    cy.get('[data-cy="account-upload-user-documents-button"]').click();

    // Create test files
    // Create test files
    const jsonFile = new File(['{"test": "data"}'], 'example.json', { type: 'application/json' });
    const imageFile = new File(['test'], 'test1.txt', { type: 'text/plain' });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Upload files via input
    cy.get('.uppy-Dashboard-input').first().selectFile(
      [
        { contents: jsonFile, fileName: 'example.json' },
        { contents: imageFile, fileName: 'test1.txt' }
      ],
      { force: true }
    );

    // Verify upload button is visible and click it
    cy.get('[data-cy="file-drop-field-upload-button"]').should('be.visible').click();

    // Wait for both uploads to complete
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200); 
    });
    // Verify files appear in list
    cy.contains('example.json').should('exist');
    cy.contains('test1.txt').should('exist');
  });
});
