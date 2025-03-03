describe('Site Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can navigate to sign in page', () => {
        cy.contains('Sign In').click();
        cy.url().should('include', '/signin');
    });

    it('can navigate to a category', () => {
        cy.contains('Phones/Digital/Computers').click();
        cy.url().should('include', 'category');
    });

    it('can search for items', () => {
        cy.get('input[placeholder="Search for anything"]').type('desk{enter}');
        cy.url().should('include', 'search');
    });

    it('navigates through user menu when logged in', () => {
        // Login first
        cy.visit('/signin');
        cy.get('input[placeholder="username"]').type('test');
        cy.get('input[placeholder="••••••"]').type('114514');
        cy.contains('button', 'Sign in').click();

        // User avatar should be visible
        cy.get('header').find('img').should('be.visible').click();

        // Menu should contain these options
        cy.contains('Profile').should('be.visible');
        cy.contains('My items').should('be.visible');
        cy.contains('Logout').should('be.visible');

        // Test logout functionality
        cy.contains('Logout').click();

        // After logout, Sign In button should reappear
        cy.contains('Sign In').should('be.visible');
    });
}); 