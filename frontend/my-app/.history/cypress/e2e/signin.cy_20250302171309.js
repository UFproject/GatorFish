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

    it('shows error message for invalid credentials', () => {
        cy.get('input[placeholder="username"]').type('wronguser');
        cy.get('input[placeholder="••••••"]').type('wrongpassword');
        cy.contains('button', 'Sign in').click();
        
        // Check for error message
        cy.contains('Invalid credentials', { timeout: 8000 }).should('be.visible');
    });

    it('successfully logs in with valid credentials', () => {
        // Using the test user from db.json
        cy.get('input[placeholder="username"]').type('test');
        cy.get('input[placeholder="••••••"]').type('114514');
        cy.contains('button', 'Sign in').click();

        // After successful login, should be redirected to home
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        
        // Avatar should be visible in header after login
        cy.get('header').find('img').should('be.visible');
    });

    it('navigates to sign up page when clicking sign up link', () => {
        cy.contains('Sign up').click();
        cy.url().should('include', '/register');
    });
}); 