describe('Sign In', () => {
    beforeEach(() => {
        cy.visit('/signin');
    });

    it('displays sign in form', () => {
        cy.contains('Sign in').should('be.visible');
        cy.get('input[placeholder="username"]').should('be.visible');
        cy.get('input[placeholder="••••••"]').should('be.visible');
    });

    it('can fill out the login form', () => {
        cy.get('input[placeholder="username"]').type('test');
        cy.get('input[placeholder="••••••"]').type('114514');
        cy.contains('button', 'Sign in').click();
    });

    it('can navigate to sign up page', () => {
        cy.contains('Sign up').click();
        cy.url().should('include', '/register');
    });
}); 