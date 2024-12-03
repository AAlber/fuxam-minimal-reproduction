
describe("Course Sidebar Drive", () => {
  before(() => {
    cy.visit(
      "/dashboard/course/" +
        Cypress.env("layerId") +
        "/learning-journey?user-drive=closed&search=&sidebar-view=drive",
    );
    cy.url().should(
      "include",
      "/dashboard/course/" + Cypress.env("layerId") + "/learning-journey",
      {
        timeout: 30000,
      },
    );
  });
  it("should display empty drive state when no files exist", () => {
    cy.get('[data-drive-instance="course-drive"]')
      .should("exist")
      .within(() => {
        cy.get(".lucide-file-x").should("be.visible");
        cy.contains("No files found").should("be.visible");
      });
  });

  it("should show home button navigation", () => {
    // Check cursor becomes pointer on hover
    cy.get("[data-cy='course-drive-home-button']")
      .should("be.visible")
      .should("have.css", "cursor", "pointer")
      .trigger("mouseover")
      .should("have.css", "cursor", "pointer");
  });

  it("should create new folder and show in breadcrumb", () => {
    // Click new folder button
    cy.get("[data-cy='course-drive-new-folder-button']").click({force: true, timeout: 10000});
    cy.get("[data-cy='course-drive-rename-input']")
      .should("be.visible")
      .should("be.focused")
      .type("Test Folder{enter}");

    // Verify folder appears in list
    cy.get("[data-drive-item]").contains("Test Folder").should("be.visible");

    // Navigate into the folder
    cy.get("[data-drive-item]").contains("Test Folder").dblclick();

    // Verify breadcrumb updates
    cy.get('[data-cy="course-drive-breadcrumb-Test Folder"]')
      .should("be.visible")
      .click();

    //Should be in empty folder
    cy.get("[data-drive-item]").should("not.exist");
  });

  it("should drag and drop file into folder", () => {
    // Create test file to drag
    const testFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    // Return to root folder
    cy.get("[data-cy='course-drive-home-button']").click();
    // Get drive instance and alias it
    cy.get('[data-drive-instance="course-drive"]').as("driveInstance");

    // Trigger drag events
    cy.get("@driveInstance").trigger("dragenter");
    cy.get("@driveInstance").trigger("dragover", {
      dataTransfer: {
        files: [testFile],
        types: ["Files"],
      },
    });
    cy.get("@driveInstance").trigger("drop", {
      dataTransfer: {
        files: [testFile],
        types: ["Files"],
      },
    });

    // Verify file appears in list
    cy.get("@driveInstance").within(() => {
      cy.get("[data-drive-item]").contains("test.txt").should("be.visible");
    });

    // Check current drive state
    cy.get("@driveInstance").within(() => {
      cy.get("[data-drive-item]").should("have.length", 2); // Test Folder and test.txt
    });
  });

  it("should allow sorting by name", () => {
    cy.get('[data-cy="course-drive-sort-button-name"]').click();
    cy.get('[data-cy="course-drive-sort-button-name"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "Test Folder");
    cy.get('[data-cy="course-drive-sort-button-name"]').click();
    cy.get('[data-cy="course-drive-sort-button-name"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "test.txt");
  });

  it("should allow sorting by type", () => {
    cy.get('[data-cy="course-drive-sort-button-type"]').click();
    cy.get('[data-cy="course-drive-sort-button-type"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "Test Folder");
    cy.get('[data-cy="course-drive-sort-button-type"]').click();
    cy.get('[data-cy="course-drive-sort-button-type"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "test.txt");
  });

  it("should allow sorting by last modified", () => {
    cy.get('[data-cy="course-drive-sort-button-lastModified"]').click();
    cy.get('[data-cy="course-drive-sort-button-lastModified"]').should(
      "be.visible",
    );
    cy.get('[data-cy="course-drive-sort-button-lastModified"]').click();
    cy.get('[data-cy="course-drive-sort-button-lastModified"]').should(
      "be.visible",
    );
    // Note: We can't reliably test the order here as it depends on creation times
  });

  it("should allow sorting by size", () => {
    cy.get('[data-cy="course-drive-sort-button-size"]').click();
    cy.get('[data-cy="course-drive-sort-button-size"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "Test Folder"); // Assuming empty folder is smaller
    cy.get('[data-cy="course-drive-sort-button-size"]').click();
    cy.get('[data-cy="course-drive-sort-button-size"]').should("be.visible");
    cy.get("[data-drive-item]").first().should("contain", "test.txt");
  });

  it("should allow file search", () => {
    // Type in search box
    cy.get('[data-cy="course-drive-search"]').click().type("test");

    // Verify search filters items
    cy.get("[data-drive-item]").should("have.length.gte", 2);

    // Further filter results by typing .txt extension
    cy.get('[data-cy="course-drive-search"] input').type(".txt");
    // Verify only one item remains after filtering
    cy.get("[data-drive-item]").should("have.length", 1);
    // Verify the remaining item is test.txt and is visible
    cy.get("[data-drive-item]").contains("test.txt").should("exist");

  });

  it("should show folder context menu with correct data-cy attributes", () => {

    // Clear the search input to reset filtering
    cy.get('[data-cy="course-drive-search"] input').clear();

    // Right click on folder
    cy.get("[data-drive-item]").contains("Test Folder").rightclick();

    // Verify context menu appears with correct data-cy attributes
    cy.get("[data-radix-menu-content]")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="course-drive-new-subfolder-button"]').should(
          "be.visible",
        );
        cy.get('[data-cy="course-drive-open-button"]').should("be.visible");
        cy.get('[data-cy="course-drive-rename-button"]').should("be.visible");
        cy.get('[data-cy="course-drive-unlock-button"]').should("be.visible");
      });
    // Click outside to close context menu using force:true since pointer-events may be disabled
    cy.get("[data-drive-item]").contains("Test Folder").click({ force: true });
  });

  it("should show file context menu with correct data-cy attributes", () => {
    // Right click on file
    cy.get("[data-drive-item]").contains("test.txt").rightclick();

    // Verify context menu appears with correct data-cy attributes
    cy.get("[data-radix-menu-content]")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="course-drive-download-button"]').should("be.visible");
        cy.get('[data-cy="course-drive-rename-button"]').should("be.visible");
      });

    // Click outside to close context menu using force:true since pointer-events may be disabled
    cy.get("[data-drive-item]").contains("Test Folder").click({ force: true });
  });

  it("should allow drag and drop of files into folders", () => {
    // Create a file to drag
    const file = new File(["test content"], "dragtest.txt", {
      type: "text/plain",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Find the target folder
    cy.get("[data-drive-item]").contains("Test Folder").as("dropTarget");

    // Trigger drag events with the file
    cy.get("@dropTarget")
      .trigger("dragenter", { dataTransfer })
      .trigger("dragover", { dataTransfer })
      .trigger("drop", { dataTransfer });

    // Click the folder expand icon first
    cy.get('[data-cy="course-drive-folder-closed-icon-Test Folder"]').click();

    // Verify drop was successful
    cy.get("[data-drive-item]").contains("dragtest.txt").should("exist");
  });

  it("should expand folder when clicking folder icon", () => {
    // Click the folder expand icon
    cy.get('[data-cy="course-drive-folder-open-icon-Test Folder"]')
      .should("be.visible")
      .click();

    // Verify folder is expanded by checking for open icon
    cy.get('[data-cy="course-drive-folder-closed-icon-Test Folder"]').should(
      "be.visible",
    );

    // Verify folder contents are visible
    cy.get("[data-drive-item]").contains("dragtest.txt").should("not.exist");
  });



  it('should handle context menu download action', () => {
    cy.log("s3 api", Cypress.env('s3_api'))
    // Intercept API requests to R2/S3
    cy.intercept('GET', `${Cypress.env('s3_api')}/**`).as('downloadRequest');
      
    // Right click on file to open context menu
    cy.get("[data-drive-item]").contains("test.txt").rightclick();
      
    // Click download option
    cy.contains('Download').click();
    
    // Verify the download request was successful
    cy.wait('@downloadRequest').then((interception) => {
      expect(interception.request.url).to.include(Cypress.env('s3_api'));
      expect(interception.response?.statusCode).to.be.oneOf([200, 206]); // 206 is for partial content
    });
  });

  it("should download file on double click", () => {
    // Intercept API requests to R2/S3
    cy.intercept('GET', `${Cypress.env('s3_api')}/**`).as('downloadRequest');
      
    // Double click the file
    cy.get("[data-drive-item]")
      .contains("test.txt")
      .should('be.visible')
      .dblclick();
  
    // Verify the download request was successful
    cy.wait('@downloadRequest').then((interception) => {
      expect(interception.request.url).to.include(Cypress.env('s3_api'))
      expect(interception.response?.statusCode).to.be.oneOf([200, 206]); // 206 is for partial content
    });
  });

  it('should handle context menu delete action', () => {
    // Right click on file to open context menu  
    cy.get("[data-drive-item]").contains("Test Folder").rightclick();
    
    // Click delete option
    cy.contains('Delete').click();
    
    // Verify confirmation dialog appears
    cy.get('[data-cy="confirmation-code-text"]').should('be.visible');
    
    // Get confirmation code text and enter it digit by digit
    cy.get('[data-cy="confirmation-code-text"]').invoke('text').then((code) => {
      // Input each digit into the corresponding slot
        cy.get(`[data-input-otp="true"]`).type(code, {force: true});
    });

    // Click confirm button
    cy.get('[data-cy="confirmation-dialog-confirm-button"]').click();
    // Verify folder is removed
    cy.get("[data-drive-item]").contains("Test Folder").should('not.exist');
    // Verify file is removed
    cy.get("[data-drive-item]").contains("dragtest.txt").should('not.exist');
  });

  it('should handle context menu rename action', () => {
    // Right click on file to open context menu
    cy.get("[data-drive-item]").contains("test.txt").rightclick();
    
    // Click rename option
    cy.contains('Rename').click();
    
    // Verify rename input appears and can be edited
    cy.get("[data-cy='course-drive-rename-input']")
      .should('be.visible')
      .wait(300)
      .type('renamed-file{enter}');
    
    // Verify file was renamed
    cy.get("[data-drive-item]").contains("renamed-file.txt").should('be.visible');
  });
  it('should handle file upload and folder navigation', () => {
    // Click upload button and add file to uploader
    cy.get('[data-cy="course-drive-upload-button"]').click();
    
    cy.get('[data-cy="course-drive-upload-input"]')
      .selectFile('cypress/fixtures/example.json', {force: true});

    // Wait for upload to complete
    cy.intercept('PUT', `${Cypress.env('s3_api')}/**`).as('uploadRequest');
    cy.wait('@uploadRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Create new folder
    cy.get('[data-cy="new-folder-button"]').click();
    cy.get('[data-cy="new-folder-input"]').type('New Test Folder{enter}');

    // Double click to open folder
    cy.get('[data-drive-item]').contains('New Test Folder').dblclick();

    // Upload another file inside the folder
    cy.get('[data-cy="course-drive-upload-button"]').click();
    cy.writeFile('cypress/downloads/test.txt', 'Test file content').then(() => {
      cy.get('[data-cy="course-drive-upload-input"]')
        .selectFile('cypress/downloads/test.txt', {force: true});
    });

    // Wait for second upload to complete
    cy.wait('@uploadRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify file appears in folder
    cy.get('[data-drive-item]').contains('test.txt').should('be.visible');

    // Click new folder button again
    cy.get('[data-cy="new-folder-button"]').click();
    
    // Create another nested folder
    cy.get('[data-cy="new-folder-input"]').type('Nested Test Folder{enter}');

    // Double click to open the nested folder 
    cy.get('[data-drive-item]').contains('Nested Test Folder').dblclick();

    // Upload a file in the nested folder
    cy.get('[data-cy="course-drive-upload-button"]').click();
    cy.writeFile('cypress/downloads/nested-test.txt', 'Nested test file content').then(() => {
      cy.get('[data-cy="course-drive-upload-input"]')
        .selectFile('cypress/downloads/nested-test.txt', {force: true});
    });

    // Wait for upload to complete
    cy.wait('@uploadRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Verify file appears in nested folder
    cy.get('[data-drive-item]').contains('nested-test.txt').should('be.visible');
  });

});
