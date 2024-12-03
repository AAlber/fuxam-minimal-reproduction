describe("Upload Multiple Files", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload multiple files to root", () => {
    // Create files to upload
    const file1 = new File(['{"key": "value"}'], 'example.json', { type: 'application/json' });
    const file2 = new File(['Test content 1'], 'test1.txt', { type: 'text/plain' });
    const file3 = new File(['Test content 2'], 'test2.txt', { type: 'text/plain' });

    // Click upload button and add files to uploader
    cy.get('[data-cy="course-drive-upload-button"]').click();
    
    cy.get('.uppy-Dashboard-input').first().selectFile(
      [
        { contents: file1, fileName: 'example.json' },
        { contents: file2, fileName: 'test1.txt' },
        { contents: file3, fileName: 'test2.txt' }
      ],
      { force: true }
    );

    // Wait for uploads to complete
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequests');
    cy.wait('@uploadRequests').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify files appear in drive
    cy.get('[data-drive-item]').contains('example.json').should('be.visible');
    cy.get('[data-drive-item]').contains('test1.txt').should('be.visible'); 
    cy.get('[data-drive-item]').contains('test2.txt').should('be.visible');
  });
});
