describe('Sign Up Page', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('displays sign up form', () => {
        cy.contains('Sign up').should('be.visible');
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
    });

    it('can fill out the registration form', () => {
        cy.get('input[name="username"]').type('newuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');
        cy.contains('button', 'Sign up').click();
    });

    it('can navigate to sign in page', () => {
        cy.contains('Sign in').click();
        cy.url().should('include', '/signin');
    });

    // Note: We won't test actual registration as it would create real users in your system
    // This would be a good place for an API intercept test
}); 