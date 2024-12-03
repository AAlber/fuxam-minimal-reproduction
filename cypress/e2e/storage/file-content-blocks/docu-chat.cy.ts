/// <reference types="cypress" />

describe("Auto create lesson from files", () => {
  beforeEach(() => {
    cy.visit(
      `/dashboard/course/${Cypress.env("layerId")}/learning-journey?open=content-block-creator&block-type=DocuChat`
    );
  });

  it("should create file content blocks automatically", () => {
    // Visit course page with specific search params
    // Check name input is visible and fill it
    cy.get('[data-cy="content-block-name-input"]').should('be.visible').type('My Files');
    // Create test files
    const jsonFile = new File(['{"test": "data"}'], 'example.json', { type: 'application/json' });
    const textFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Intercept PUT requests to S3
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // Upload files via input
    // Get the drop target
    cy.get('.uppy-Dashboard-innerWrap').as('dropTarget');

    // Simulate drag and drop for both files
    cy.get('@dropTarget').trigger('dragenter', {
      dataTransfer: {
        files: [jsonFile, textFile],
        types: ['Files']
      }
    });

    cy.get('@dropTarget').trigger('dragover', {
      dataTransfer: {
        files: [jsonFile, textFile], 
        types: ['Files']
      }
    });

    cy.get('.uppy-Dashboard-dropFilesHereHint').trigger('drop', {
      dataTransfer: {
        files: [jsonFile, textFile],
        types: ['Files']
      }
    });

    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("example.json").should("be.visible");
    cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test.txt").should("be.visible");
    // Click create block button
    cy.get('[data-cy="content-block-create-button"]').click();

    // Wait for both uploads to complete
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify files appear in content blocks
    cy.contains('example.json').should('exist');
    cy.contains('test.txt').should('exist');
  });
});
