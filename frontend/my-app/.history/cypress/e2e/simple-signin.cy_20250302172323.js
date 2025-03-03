describe('Simple Sign In', () => {
    it('can visit the sign in page', () => {
        cy.visit('/signin');
        cy.contains('Sign in').should('be.visible');
    });

    it('can fill out the login form', () => {
        cy.visit('/signin');
        cy.get('input[placeholder="username"]').type('testuser');
        cy.get('input[placeholder="••••••"]').type('password123');
        cy.contains('button', 'Sign in').click();
    });
}); 