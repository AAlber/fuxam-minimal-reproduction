/// <reference types="cypress" />

describe("Auto create lesson from files", () => {
  beforeEach(() => {
    cy.visit(
      `/dashboard/course/${Cypress.env("layerId")}/learning-journey`
    );
  });

  it("should create file content blocks automatically", () => {
    // Visit course page with specific search params
    // Check name input is visible and fill it

    // Open content block dropdown menu
    cy.get('[data-cy="content-block-initialize-button"]').first().click();

    // Click User Deliverables submenu trigger
    cy.get('[role="menuitem"]')
      .contains('User Deliverables')
      .click();

    // Click Assessment option in submenu
    cy.get('[role="menuitem"]')
      .contains('Assessment')
      .click();

    // Select image restriction
    cy.get('.lucide-image')
      .trigger('dragstart')
      .get('[data-cy="workbench-main-dropzone"]')
      .first()
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .get('.lucide-image')
      .trigger('dragend')

    cy.get('[data-cy="workbench-image-selector"]').should('be.visible');
    
    // // Create test files
    // const jsonFile = new File(['{"test": "data"}'], 'example.json', { type: 'application/json' });
    // const textFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // // Intercept PUT requests to S3
    // cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');

    // // Upload files via input
    // // Get the drop target
    // cy.get('.uppy-Dashboard-innerWrap').as('dropTarget');

    // // Simulate drag and drop for both files
    // cy.get('@dropTarget').trigger('dragenter', {
    //   dataTransfer: {
    //     files: [jsonFile, textFile],
    //     types: ['Files']
    //   }
    // });

    // cy.get('@dropTarget').trigger('dragover', {
    //   dataTransfer: {
    //     files: [jsonFile, textFile], 
    //     types: ['Files']
    //   }
    // });

    // cy.get('.uppy-Dashboard-dropFilesHereHint').trigger('drop', {
    //   dataTransfer: {
    //     files: [jsonFile, textFile],
    //     types: ['Files']
    //   }
    // });

    // cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("example.json").should("be.visible");
    // cy.get(".uppy-Dashboard-Item-fileInfoAndButtons").contains("test.txt").should("be.visible");
    // // Click create block button

    // // Wait for both uploads to complete
    // cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
    //   expect(interception.response?.statusCode).to.equal(200);
    // });
    // cy.wait('@uploadRequests', { timeout: 30000 }).then((interception) => {
    //   expect(interception.response?.statusCode).to.equal(200);
    // });

    // // Verify files appear in content blocks
    // cy.contains('example.json').should('exist');
    // cy.contains('test.txt').should('exist');
  });
});
