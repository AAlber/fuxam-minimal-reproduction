describe("Upload Single File", () => {
  before(() => {
    cy.visitCourseDrivePage();
  });

  it("should upload single file to root", () => {
    // Click upload button and add file to uploader
    cy.get('[data-cy="course-drive-upload-button"]').click();
    
    const file = new File(['{"key": "value"}'], 'example.json', { type: 'application/json' });
    cy.get('.uppy-Dashboard-input').first()
      .selectFile({ contents: file, fileName: 'example.json' }, { force: true });

    // Wait for upload to complete
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequest');
    cy.wait('@uploadRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify file appears in drive
    cy.get('[data-drive-item]').contains('example.json').should('be.visible');
  });
});
