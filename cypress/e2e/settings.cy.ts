/// <reference types="cypress" />

describe(
  "Click through settings page",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      cy.intercept("/api/institution-settings/get-institution-settings").as(
        "general",
      );
      cy.intercept("/api/role/get-admins-of-institution").as("admins");

      cy.intercept("/api/rating-schema/get-rating-schemas*").as("rating");

      cy.intercept(
        "/api/institution-user-group/user-groups-of-institution*",
      ).as("user-data");
      cy.intercept(
        "/api/institution-user-data-field/get-institution-user-data-fields*",
      ).as("user-data-field");

      cy.intercept(
        "/api/institution-settings/get-institution-storage-status*",
      ).as("institution-storage");

      cy.intercept("/api/institution-settings/get-institution-settings*").as(
        "addons",
      );

      cy.intercept("/api/ai/budget/get-report").as("ai-report");
      cy.intercept("/api/administration/get-deleted-layers").as(
        "get-deleted-layers",
      );

      cy.intercept("/api/stripe/get-customer-and-tax-id*").as(
        "customer-tax-id",
      );
      cy.intercept("/api/stripe/get-invoices*").as("invoices");
      cy.intercept("/api/stripe/get-payment-methods*").as("payment-methods");

      cy.intercept("/api/stripe/paid-access-passes/get-account*").as(
        "access-pass",
      );
      cy.intercept(
        "/api/stripe/access-passes/get-access-pass-status-infos*",
      ).as("pass-status-info");
    });

    context("General Page", () => {
      it("navigate to General Page", () => {
        cy.get(":nth-child(6) > .relative").click(); // settings
        cy.wait("@general")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Roles & Permissions Page", () => {
        cy.get("#cards > :nth-child(2) > .flex").click();
        cy.wait("@admins")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("LMS Page", () => {
        cy.get("#cards > :nth-child(3) > .flex").click();
        cy.wait("@rating")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("User Management Page", () => {
        cy.get("#cards > :nth-child(4) > .flex").click();
        cy.wait("@user-data")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@user-data-field")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Communication Page", () => {
        cy.get("#cards > :nth-child(5) > .flex").click();
      });
      it("Addons & Integrations Page", () => {
        cy.get("#cards > :nth-child(6) > .flex").click();
        /*cy.wait("@addons")
          .its("response.statusCode")
          .should("be.within", 200, 399);*/
      });
      it("Schedule Page", () => {
        cy.get("#cards > :nth-child(8) > .flex").click();
      });
      it("Video Calls Page", () => {
        cy.get(":nth-child(9) > .flex").click();
      });
      it("Room management Page", () => {
        cy.get(":nth-child(10) > .flex").click();
      });
      it("Storage Page", () => {
        cy.get(":nth-child(11) > .flex").click();
        cy.wait("@institution-storage")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Ai Page", () => {
        cy.get(":nth-child(12) > .flex").click();
        cy.wait("@ai-report")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Data & Privacy Page", () => {
        cy.get(":nth-child(13) > .flex").click();
        cy.wait("@get-deleted-layers")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Billing Page", () => {
        cy.get(":nth-child(15) > .flex").click();
        cy.wait("@customer-tax-id")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@invoices")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@payment-methods")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
      it("Access Pass Page", () => {
        cy.get(":nth-child(16) > .flex").click();
        cy.wait("@access-pass")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@pass-status-info")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
  },
);
