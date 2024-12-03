/// <reference types="cypress" />

describe("Signed in", {}, () => {
  context("test", () => {
    it("Test 1", () => {
      cy.wait(100);
    });
    it("Test 2", () => {
      cy.wait(100);
    });
  });
  context("test 2", () => {
    it("Test 1", () => {
      cy.wait(100);
    });
    it("Test 2", () => {
      cy.wait(100);
    });
  });
});
