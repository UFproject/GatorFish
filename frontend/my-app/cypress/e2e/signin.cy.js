describe('Sign In', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('displays sign in form', () => {
        cy.get('form').should('be.visible');
    });

    it('has username and password fields', () => {
        cy.get('input[placeholder="username"]').should('exist');
        cy.get('input[type="password"]').should('exist');
    });

    it('can type in login fields', () => {
        cy.get('input[placeholder="username"]').type('test');
        cy.get('input[type="password"]').type('password123');
    });

    it('can navigate to sign up page', () => {
        cy.contains('Sign up').click();
        cy.url().should('include', '/register');
    });
}); 