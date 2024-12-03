/// <reference types="cypress" />

describe("Save documents from user management to user drive", () => {
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

  it("should upload documents and save them to user drive", () => {
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

    // Click save button for first file
    cy.get('[data-cy="file-saver-button"]').first().click();

    // Click the save button in modal
    cy.get('[data-cy="drive-save-button"]').click();

    // Click save button for second file 
    cy.get('[data-cy="file-saver-button"]').last().click();

    // Click the save button in modal
    cy.get('[data-cy="drive-save-button"]').click();

    // Open user drive to verify files
    cy.get('[data-cy="open-user-drive-button"]').click();

    // Verify files are in user drive
    cy.get('[data-drive-instance="user-drive-resizable"]').within(() => {
      cy.get("[data-drive-item]").contains("example.json").should("be.visible");
      cy.get("[data-drive-item]").contains("test1.txt").should("be.visible");
    });
  });
});
