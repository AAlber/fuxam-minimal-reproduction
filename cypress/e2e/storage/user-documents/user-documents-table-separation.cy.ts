/// <reference types="cypress" />

describe("User Documents Table Separation", () => {
  let userId: string;

  before(() => {
    // First visit home page to get userId
    cy.visit("/");
    
    // Extract userId from URL for later use
    cy.url().then(url => {
      userId = url.match(/user_[^?]+/)[0];
    });
  });

  it("should upload document from account page", () => {
    cy.visit("/en/dashboard/account/overview");

    // Click upload button
    cy.get('[data-cy="account-upload-user-documents-button"]').click();

    // Create test file
    const accountFile = new File(['{"test": "data"}'], 'account_doc.json', { type: 'application/json' });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Upload file via input
    cy.get('.uppy-Dashboard-input').first().selectFile(
      [{ contents: accountFile, fileName: 'account_doc.json' }],
      { force: true }
    );

    // Verify upload button is visible and click it
    cy.get('[data-cy="file-drop-field-upload-button"]').should('be.visible').click();

    // Wait for upload to complete
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify file appears in list
    cy.contains('account_doc.json').should('exist');
  });

  it("should show user-uploaded icon in management table and handle direct upload", () => {
    // Navigate to user documents management page
    cy.visit(`/en/dashboard/user-management/user/${userId}/documents`);

    // Verify account-uploaded document appears with user icon
    cy.contains('account_doc.json')
      .parent()
      .within(() => {
        cy.get('.lucide-user').should('exist');
      });

    // Upload new document directly to management table
    cy.get('[data-cy="user-management-user-documents-upload-button"]').click();

    // Create test file
    const managementFile = new File(['test content'], 'management_doc.txt', { type: 'text/plain' });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Upload file via input
    cy.get('.uppy-Dashboard-input').first().selectFile(
      [{ contents: managementFile, fileName: 'management_doc.txt' }],
      { force: true }
    );

    // Wait for upload to complete
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify management-uploaded file appears without user icon
    cy.contains('management_doc.txt')
      .parent()
      .within(() => {
        cy.get('.lucide-user').should('not.exist');
      });
  });

  it("should only show user-uploaded documents in account page", () => {
    // Navigate back to account page
    cy.visit("/en/dashboard/account/overview");

    // Verify account-uploaded document is still visible
    cy.contains('account_doc.json').should('exist');

    // Verify management-uploaded document is not visible
    cy.contains('management_doc.txt').should('not.exist');
  });
});
