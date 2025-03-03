describe('Sign Up Page', () => {
    it('can access sign up form', () => {
        cy.visit('/login');
        cy.contains('Sign up').click();
    });

    it('has form fields', () => {
        cy.visit('/register');
        cy.get('form').should('be.visible');
    });

    it('can type in registration fields', () => {
        cy.visit('/register');
        cy.get('input[name="username"]').type('newuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
    });

    // Note: We won't test actual registration as it would create real users in your system
    // This would be a good place for an API intercept test
}); 