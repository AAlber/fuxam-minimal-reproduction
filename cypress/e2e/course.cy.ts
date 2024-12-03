/// <reference types="cypress" />

describe("Course", {}, () => {
  beforeEach(() => {
    cy.intercept("/api/kv-cached/get-course-content-blocks*").as("info");
    cy.intercept("/api/cloudflare/list-files-in-directory*").as("drive");
    cy.intercept("/api/courses/get-content-block-user-status*").as(
      "learning-journey",
    );
    cy.intercept("/api/peer-feedback/get-all-for-layer/*").as("peer-feedback");
    cy.intercept("/api/courses/get-all-course-members").as("courses");
    cy.intercept("/api/users/get-by-layer/*").as("course-users");
    cy.intercept("/api/course-goals/*").as("course-settings");
    cy.intercept("/api/ai/ai-tool-button-completion").as("ai-tool");
    cy.intercept("/api/content-block/create").as("create-block");
    cy.intercept(" /api/content-block/delete").as("delete-block");
    cy.intercept("/api/schedule/get-possible-attendees*").as(
      "possible-attendees",
    );
    cy.intercept("/api/schedule/get-users-and-availability*").as(
      "users-and-availability",
    );
    cy.intercept("/api/schedule/create-appointment").as("create-appointment");
  });
  context("Course Chat", () => {
    it("Message", () => {
      cy.contains(/^Chat$/).click();
      cy.get(".overflow-y-scroll > p").type("Test");
      cy.get(".hidden > .w-full > .inline-flex").click();
    });
    it("Gif", () => {
      cy.get(".grow > .inline-flex").click();
      cy.get(":nth-child(8) > .flex").click();
      cy.wait(6000);
      cy.get(".grid > :nth-child(1) > .size-full").click();
      cy.wait(2000);
    });
  });
  context("Splitscreen", () => {
    it("navigate to info", () => {
      //cy.wait("@info").its("response.statusCode").should("be.within", 200, 399);
    });
    it("navigate to Chat", () => {
      cy.contains(/^Chat$/).click();
    });
    it("navigate to drive", () => {
      cy.contains(/^(Drive|Dateien)$/).click();
      cy.wait("@drive")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("Close the Splitscreen", () => {
      cy.get(".space-x-2 > .hover\\:text-muted-contrast").click();
      cy.wait(1000);
      cy.get(".space-x-2 > .hover\\:text-muted-contrast").click();
      cy.wait(1000);
    });
  });
  context("Course Icon & Banner", () => {
    it("Course Icon", () => {
      cy.get(".inline-flex > .size-28").click();
      cy.contains("Emoji").click();
      cy.contains("button", "😊").click();
      cy.contains("button", "😎").click();
    });
    /*it("Course Banner", () => {
        cy.get(".-mt-2 > :nth-child(1) > .group").trigger("mouseover");
        cy.get("#trigger-button").invoke("show");
        cy.get("#trigger-button").should("be.visible").click({ force: true });
        
      });*/
  });
  context("Course Tabs", () => {
    it("Course User", () => {
      cy.get(".w-auto > :nth-child(2)").click();
      //cy.wait("@courses").its("response.statusCode").should("be.within", 200, 399);
      cy.wait("@course-users")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("Course Settings", () => {
      cy.get(".w-auto > :nth-child(3)").click();
      cy.wait("@course-settings")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
  });
  context("Course Content Block", () => {
    it("Create Hand-in and Use AI Wand", () => {
      cy.contains(/^(Learning Journey|Lernreise)$/).click();
      cy.contains(/^(Create|Erstellen)$/).click();
      cy.contains(/(Deliverables|Abgaben)/).click();
      cy.contains(/(Hand-in|Datei Abgabe)/).click();
      cy.get("#title").should("be.visible").click();
      cy.get("#title").type("Test");
      cy.get("div.grid > :nth-child(4) > div.relative > .flex").click();
      cy.get("div.grid > :nth-child(4) > div.relative > .flex").type(
        "little gramar mistake",
      );
      cy.get("form > .inline-flex").click();
      cy.wait("@ai-tool")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.contains(/^(Publish|Erstellen)$/).click();
      cy.wait("@create-block")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@learning-journey")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("Create a Section", () => {
      cy.contains(/^(Learning Journey|Lernreise)$/).click();
      cy.contains(/^(Create|Erstellen)$/).click();
      cy.contains(/(Section|Abschnitt)/).click();
      cy.get("#title").should("be.visible").click();
      cy.get("#title").type("My Section");
      cy.contains(/^(Publish|Erstellen)$/).click();
      cy.wait("@create-block")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@learning-journey")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    /*it("Add a description", () => {
        cy.get('tbody>tr:nth-child(2)>td>div>button').click();
      });*/
    it("Toggle Table top view", () => {
      cy.get('[id*="headlessui-switch-"]').click();
      cy.wait(1000);
      cy.get('[id*="headlessui-switch-"]').click();
    });
    it("Delete Block", () => {
      cy.get('[id*="headlessui-switch-"]').click();
      cy.get('div[id*="radix-"] > .inline-flex').first().click();
      cy.get('[data-testid="button-option-block-delete"]').click();
      cy.get(".bg-destructive").click();
      cy.wait("@delete-block")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("Course event", () => {
      cy.contains(/^(Schedule|Zeitplan)$/).click();
      cy.get(".relative > .gap-2 > .inline-flex").click();
      cy.wait("@possible-attendees")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@users-and-availability")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.get(":nth-child(2) > .relative > #title").click();
      cy.get(":nth-child(2) > .relative > #title").type("Test Event #1");
      cy.get(".mt-4 > .bg-primary").click();
      cy.wait("@create-appointment")
        .its("response.statusCode")
        .should("be.within", 200, 399);

      cy.wait("@info").its("response.statusCode").should("be.within", 200, 399);
    });
    it("Course event by clicking the + icon", () => {
      cy.get(".mt-2 > .inline-flex").click();
      cy.wait("@possible-attendees")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@users-and-availability")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.get(":nth-child(2) > .relative > #title").click();
      cy.get(":nth-child(2) > .relative > #title").type("Test Event #2");
      cy.get(".mt-4 > .bg-primary").click();
      cy.wait("@create-appointment")
        .its("response.statusCode")
        .should("be.within", 200, 399);

      cy.wait("@info").its("response.statusCode").should("be.within", 200, 399);
    });
  });
});
