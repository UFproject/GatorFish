// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands') 

// Set up global hooks
beforeEach(() => {
    // Set up API mocking for all tests if enabled
    if (Cypress.env('MOCK_API')) {
        // Mock auth APIs
        cy.mockAuthAPIs();

        // Mock product APIs
        cy.mockProductAPIs();
    }

    // Set default headers for all requests
    cy.intercept('*', (req) => {
        req.headers['Accept'] = 'application/json';
    });
});

// Handle uncaught exceptions better
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    // This is useful for 3rd party library errors we don't care about
    console.log('Uncaught exception:', err.message);
    return false;
}); 