/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { verify } from "crypto";
import "./commands";
import { setupClerkTestingToken } from "@clerk/testing/cypress";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add(`signIn`, () => {
  setupClerkTestingToken();

  cy.log(`Signing in.`);
  cy.visit("/", { failOnStatusCode: false });

  cy.clerkLoaded();

  cy.clerkSignIn({
    identifier: Cypress.env(`test_email`),
    password: Cypress.env(`test_password`),
    strategy: "password",
  });
});

before(() => {
  cy.session("signingIn", cy.signIn);
  // cy.request({
  //   url: "/api/testing/create-trial-institution-and-add-user",
  //   timeout: 60000,
  //   method: "POST",
  // }).then((response) => {
  //   const responseBody = response.body;
  //   Cypress.env("layerId", responseBody.layerId);
  // });
});

after(() => {
  cy.request({
    method: "POST",
    url: "/api/testing/delete-all-test-institutions",
    timeout: 60000,
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  cy.log(err.toString());
  return false;
});

Cypress.Commands.add("visitCourseDrivePage", () => {
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

Cypress.Commands.add(
  "dragAndDropFile",
  (selector: string, fileName: string) => {
    const testFile = new File(["test content"], fileName, {
      type: "text/plain",
    });

    cy.get(selector).as("dropTarget");
    cy.get("@dropTarget").trigger("dragenter");
    cy.get("@dropTarget").trigger("dragover", {
      dataTransfer: {
        files: [testFile],
        types: ["Files"],
      },
    });
    cy.get("@dropTarget").trigger("drop", {
      dataTransfer: {
        files: [testFile],
        types: ["Files"],
      },
    });
    cy.get(selector).within(() => {
      cy.get("[data-drive-item]").contains(fileName).should("be.visible");
    });
  },
);

Cypress.Commands.add(
  "dragAndDropFiles",
  (selector: string, fileNames: string[]) => {
    const testFiles = fileNames.map(
      (fileName) =>
        new File(["test content"], fileName, { type: "text/plain" }),
    );

    cy.get(selector).as("dropTarget");
    cy.get("@dropTarget").trigger("dragenter");
    cy.get("@dropTarget").trigger("dragover", {
      dataTransfer: {
        files: testFiles,
        types: ["Files"],
      },
    });
    cy.get("@dropTarget").trigger("drop", {
      dataTransfer: {
        files: testFiles,
        types: ["Files"],
      },
    });
    cy.get(selector).within(() => {
      fileNames.forEach((fileName) => {
        cy.get("[data-drive-item]").contains(fileName).should("be.visible");
      });
    });
  },
);

Cypress.Commands.add("signOut", () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  localStorage.clear();
});
