/// <reference types="cypress" />

describe("Delete documents from user settings page", () => {
  beforeEach(() => {
    // First visit home page to get userId
    cy.visit("/");
    
    // Extract userId from URL
    cy.url().then(url => {
      const userId = url.match(/user_[^?]+/)[0];
      
      // Navigate to user documents page with extracted userId
      cy.visit(`/en/dashboard/user-management/user/${userId}/documents`);
    });
  });

  it("should delete uploaded documents successfully", () => {
    // Click upload button
    cy.get('[data-cy="user-management-user-documents-upload-button"]').click();

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

    // Delete first document
    cy.get('[data-cy="user-management-user-documents-delete-button"]').first().click();

    // Click confirm button in confirmation dialog
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();
    
    // Verify first document is removed
    cy.contains('example.json').should('not.exist');

    // Delete second document
    cy.get('[data-cy="user-management-user-documents-delete-button"]').first().click();

    // Click confirm button in confirmation dialog
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();
    // Verify second document is removed
    cy.contains('test1.txt').should('not.exist');
  });
});
