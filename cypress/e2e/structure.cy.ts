/// <reference types="cypress" />

describe("Structure", {}, () => {
  beforeEach(() => {
    cy.intercept("/api/administration/rename-layer").as("rename-layer");
    cy.wait(1000);
  });
  it("Structure", () => {
    cy.log("Create Layer");
    cy.get("ul.flex > .flex-col > :nth-child(4) > .relative").click();
    cy.wait("@course-tree");
    cy.contains(/Layer|Ebene/).click();
    cy.get(".gap-2 > .flex").first().click();
    cy.get(".gap-2 > .flex").first().type("Test Layer");
    cy.get(".gap-2 > .inline-flex").click();
    cy.wait("@create-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Create Course");
    cy.contains(/Course|Kurs/).click();
    cy.get(".gap-2 > .flex").first().click();
    cy.get(".gap-2 > .flex").first().type("Mathe");
    cy.get(".gap-2 > .inline-flex").click();
    cy.wait("@create-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Add Course");
    cy.contains("Test Layer")
      .siblings()
      .filter("div")
      .children()
      .filter('button[id*="radix"]')
      .first()
      .click();
    cy.contains(/Add Course|Kurs hinzufügen/).click();

    cy.get("#rename-modal-input").click();
    cy.get("#rename-modal-input").type("Informatik");
    cy.contains(/^(Create|Erstellen)$/).click();
    cy.wait("@create-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Add Sublayer");
    cy.contains("Test Layer")
      .siblings()
      .filter("div")
      .children()
      .filter('button[id*="radix"]')
      .first()
      .click();
    cy.contains(/Add Sublayer|Unter Ebene hinzufügen/).click();

    cy.get("#rename-modal-input").click();
    cy.get("#rename-modal-input").type("Sublayer");
    cy.contains(/^(Create|Erstellen)$/).click();
    cy.wait("@create-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Rename Course");
    cy.contains("Mathe")
      .siblings()
      .filter("div")
      .children()
      .filter('button[id*="radix"]')
      .click();
    cy.contains(/Settings|Einstellungen/).click();

    cy.get(":nth-child(2) > :nth-child(1) > .relative > #title").click();
    cy.get(":nth-child(2) > :nth-child(1) > .relative > #title").type(
      "{selectAll}",
    );
    cy.get(":nth-child(2) > :nth-child(1) > .relative > #title").type(
      "Renamed-Course",
    );
    cy.contains(/^(Save|Speichern)$/).click();
    cy.wait("@rename-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Display Name");
    cy.contains("Renamed-Course")
      .siblings()
      .filter("div")
      .children()
      .filter('button[id*="radix"]')
      .click();

    cy.contains(/Settings|Einstellungen/).click();

    cy.get(":nth-child(4) > :nth-child(1) > .relative > #title").click();
    cy.get(":nth-child(4) > :nth-child(1) > .relative > #title").type(
      "Mathematik",
    );
    cy.contains(/^(Save|Speichern)$/).click();
    cy.wait("@rename-layer")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Mirror Course");
    cy.contains("Renamed-Course")
      .siblings()
      .filter("div")
      .children()
      .filter('button[id*="radix"]')
      .click();
    cy.contains(/Mirror Course|Kurs spiegeln/).click();
  });
});
