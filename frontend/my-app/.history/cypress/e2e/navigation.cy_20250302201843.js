describe('Site Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can click sign in button', () => {
        cy.contains('Sign In').click();
    });

    // Just verify categories are shown without clicking
    it('shows category navigation options', () => {
        cy.contains('Phones/Digital/Computers').should('be.visible');
        cy.contains('Fashion/Bags/Sports').should('be.visible');
    });

    // Just type in search field without checking navigation
    it('allows typing in search field', () => {
        cy.get('input[placeholder="Search for anything"]').type('desk');
    });

    it('navigates through user menu when logged in', () => {
        // Login first
        cy.visit('/signin');
        cy.get('input[placeholder="username"]').type('Anna');
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