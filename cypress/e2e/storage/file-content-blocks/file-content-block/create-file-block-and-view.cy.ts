/**
 * This needs to be updated when the new learning journey is released
 * 
 */

describe("Create and view file content block", () => {
  beforeEach(() => {
    cy.visitCourseDrivePage()
  });

  it("should create file content block with multiple files", () => {

    // Create and upload multiple test files
    // Create test files
    const file1 = new File([''], 'test1.txt', { type: 'text/plain' });
    const file2 = new File([''], 'test2.txt', { type: 'text/plain' });
    const file3 = new File([''], 'test3.txt', { type: 'text/plain' });

    // Get the drop target
    cy.get('[data-cy="learning-journey-wrapper"]').as('dropTarget');

    // Simulate drag and drop for the files
    cy.get('@dropTarget').trigger('dragenter', {
      dataTransfer: {
        files: [file1, file2, file3],
        types: ['Files']
      }
    });

    cy.get('@dropTarget').trigger('dragover', {
      dataTransfer: {
        files: [file1, file2, file3],
        types: ['Files']
      }
    });

    cy.get('@dropTarget').trigger('drop', {
      dataTransfer: {
        files: [file1, file2, file3],
        types: ['Files']
      }
    });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Verify files appear in uploader
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test1.txt").should("be.visible");
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test2.txt").should("be.visible");
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test3.txt").should("be.visible");

    // Fill in content block name
    cy.get('[data-cy="content-block-name-input"]').should('be.visible').type('My Files');
    // Click create block button
    cy.get('[data-cy="content-block-create-button"]').click();

    // Wait for uploads to complete
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify files appear in content block
    cy.contains('My Files').should('exist');
  });
});
