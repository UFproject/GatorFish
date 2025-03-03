describe('Sign In', () => {
    beforeEach(() => {
        cy.visit('/signin');
    });

    it('displays sign in form with all fields', () => {
        cy.contains('h1', 'Sign in').should('be.visible');
        cy.get('input[placeholder="username"]').should('be.visible');
        cy.get('input[placeholder="••••••"]').should('be.visible');
        cy.contains('button', 'Sign in').should('be.visible');
    });

    it('displays link to sign up page', () => {
        cy.contains("Don't have an account?").should('be.visible');
        cy.contains('Sign up').should('have.attr', 'href', '/register');
    });

    it('successfully logs in with valid credentials', () => {
        cy.get('input[placeholder="username"]').type(Cypress.env('TEST_USERNAME') || 'testuser');
        cy.get('input[placeholder="••••••"]').type(Cypress.env('TEST_PASSWORD') || 'password123');
        cy.contains('button', 'Sign in').click();

        // Verify successful login - redirected to homepage with notification
        cy.url().should('include', '/');
        cy.contains('Login successful', { timeout: 8000 }).should('be.visible');

        // Verify avatar appears when logged in
        cy.get('header img').should('be.visible');
    });
}); 