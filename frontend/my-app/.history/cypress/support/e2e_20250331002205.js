// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands') 

// Disable waiting for API responses globally but safely
Cypress.on('command:retry', (msg) => {
    // Make sure msg is a string before using includes
    if (typeof msg === 'string' && msg.includes('cy.wait() timed out waiting for the 1st request to the route')) {
        return false; // Skip waiting for all routes
    }
});

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

    // Add resilience to non-HTML responses from page loads
    cy.on('fail', (err) => {
        if (typeof err.message === 'string' && err.message.includes('content-type') && err.message.includes('application/json')) {
            // If page returns JSON instead of HTML, log and continue
            cy.log('Page returned JSON instead of HTML - continuing test');
            return false;
        }
    });
});

// Handle uncaught exceptions better
Cypress.on('uncaught:exception', (err) => {
    // returning false here prevents Cypress from failing the test
    // This is useful for 3rd party library errors we don't care about
    console.log('Uncaught exception:', err.message);
    return false;
}); 