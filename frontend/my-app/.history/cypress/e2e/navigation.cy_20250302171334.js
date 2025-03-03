describe('Site Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('navigates to sign in page when clicking Sign In button', () => {
        cy.contains('Sign In').click();
        cy.url().should('include', '/signin');
    });

    it('navigates to search results when searching', () => {
        cy.get('input[placeholder="Search for anything"]').type('desk{enter}');
        cy.url().should('include', 'search');
        cy.url().should('include', 'desk');
    });

    it('navigates to category page when clicking a category', () => {
        cy.contains('Phones/Digital/Computers').click();
        cy.url().should('include', 'category');
        cy.url().should('include', 'Phones');
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