/// <reference types="cypress" />

describe("User Management", {}, () => {
  beforeEach(() => {
    cy.intercept("/api/users/create-institution-user").as("create-user");
    cy.intercept("/api/role/get-layers-user-has-special-access-to").as(
      "access-to",
    );
    cy.intercept("/api/role/create-role").as("create-role");
    cy.intercept("/api/notes/create-user-notes").as("create-note");
    cy.intercept("/api/notes/update-user-notes*").as("update-note");
    cy.intercept("/api/notes/delete-user-notes*").as("delete-note");
    cy.intercept("/api/schedule/get-appointments-of-week/*").as("appointments");
    cy.intercept("/api/role/get-top-most-layers-user-has-access-to*").as(
      "has-access-to",
    );
  });
  it("User Management", () => {
    cy.get(":nth-child(5) > .relative").first().click();
    cy.log("Create User 1");
    cy.contains(/^(Create|Erstellen)$/).click();
    cy.contains(/^(Create user|Erstellen Benutzer*innen)$/).click();
    cy.get("[id=name]").click();
    cy.get("[id=name]").type("User 1");
    cy.get("[id=email]").click();
    cy.get("[id=email]").type(`test1-${Date.now()}@mail.com`);
    cy.get(".flex-col-reverse > .inline-flex").click();
    cy.wait("@create-user")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Create User 2");
    cy.contains(/^(Create|Erstellen)$/).click();
    cy.contains(/^(Create user|Erstellen Benutzer*innen)$/).click();
    cy.get("[id=name]").click();
    cy.get("[id=name]").type("User 2");
    cy.get("[id=email]").click();
    cy.get("[id=email]").type(`test2-${Date.now()}@mail.com`);
    cy.get(".flex-col-reverse > .inline-flex").click();
    cy.wait("@create-user")
      .its("response.statusCode")
      .should("be.within", 200, 399);
    cy.wait(1000);

    cy.log("Group Chat");
    cy.get('div>div>table>tbody>tr>td>div>button[role="checkbox"]')
      .eq(1)
      .click();
    cy.get('div>div>table>tbody>tr>td>div>button[role="checkbox"]')
      .eq(2)
      .click();
    cy.get(":nth-child(4) > .inline-flex").click();
    //cy.get(':nth-child(1) > :nth-child(1) > .overflow-y-scroll').eq(0).click();
    cy.get(".overflow-y-scroll > p").click();
    cy.get(".overflow-y-scroll > p").type("Test");
    cy.get(".hidden > .w-full > .inline-flex").click();
    cy.wait(2000);

    cy.log("Delete Group Chat");
    cy.get(":nth-child(1) > :nth-child(1) > .overflow-y-scroll").eq(0).click();
    cy.get(
      ':nth-child(1) > :nth-child(1) > .overflow-y-scroll>div>div>div>[id*="radix-"]',
    ).click();
    cy.get('[role="group"] > .cursor-pointer > span').click();
    cy.contains(/^(Delete|Löschen)$/).click();
    cy.get(":nth-child(5) > .relative").click();

    cy.log("Give access to");
    cy.get('div>div>table>tbody>tr>td>div>button[role="checkbox"]')
      .eq(2)
      .click();
    cy.get('div[class*="flex flex-1"]>div>button[aria-controls*="radix-"]')
      .first()
      .click();
    cy.wait("@access-to")
      .its("response.statusCode")
      .should("be.within", 200, 399);
    cy.get('[role="presentation"]>[role="group"]').eq(0).click();
    cy.wait("@create-role")
      .its("response.statusCode")
      .should("be.within", 200, 399);

    cy.log("Create Notes");
    cy.get(
      ':nth-child(2) > [style="width: calc(var(--col-name-size) * 1px);"] > :nth-child(1) > .group > .w-auto > .truncate',
    ).click();
    cy.get(".relative > .inline-flex").click();
    cy.get(".tiptap > p").click();
    cy.get(".tiptap > p").type("Hello World!");
    cy.get(".gap-x-2 > .bg-primary").click();
    cy.wait("@create-note");
    cy.wait(2000);

    cy.log("Update Notes");
    cy.get('[aria-haspopup="dialog"] > .inline-flex').click();
    cy.get('h3>button[aria-controls*="radix-"]>svg').click();
    cy.get(".has-focus").click();
    cy.get(".has-focus").type("{selectAll}");
    cy.get(".has-focus").type("Some note");
    cy.get(".gap-x-2 > .bg-primary").click();
    cy.wait("@update-note");
    cy.wait(2000);

    cy.log("Delete Notes");
    cy.get(".gap-x-2 > .bg-accent\\/80").click();
    cy.get(".bg-destructive").click();
    cy.wait("@delete-note");
    cy.wait(2000);

    cy.log("User Calendar");
    cy.contains(/^(Calendar|Kalendar)$/).click();
    cy.get(".min-h-\\[33px\\] > .absolute > :nth-child(2)").click();
    cy.get(".min-h-\\[33px\\] > .absolute > :nth-child(2)").click();
    cy.wait("@appointments");
    cy.get(".absolute > .ml-1").click();
    cy.get(".absolute > .ml-1").click();
    cy.wait("@appointments");
    cy.get(".h-14 > :nth-child(1) > .inline-flex").click();

    /*cy.log("User Overview");
      cy.get(':nth-child(3) > [style="width: calc(var(--col-name-size) * 1px);"] > :nth-child(1) > .group > .w-auto > .truncate').click();
      cy.wait("@has-access-to");
      cy.get('.ml-2 > .inline-flex').click();
      cy.wait("@access-to");*/
  });
});
