// Custom commands for Cypress tests

// Login command for reuse
Cypress.Commands.add('login', (username = Cypress.env('TEST_USERNAME'), password = Cypress.env('TEST_PASSWORD')) => {
    cy.visit('/signin');
    cy.get('input[placeholder="username"]').type(username);
    cy.get('input[placeholder="••••••"]').type(password);
    cy.contains('button', 'Sign in').click();
    cy.url().should('include', '/');
});

// Add data-testid attributes to elements for more reliable selection
Cypress.Commands.add('getByTestId', (testId) => {
    return cy.get(`[data-testid="${testId}"]`);
}); 