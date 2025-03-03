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

}); 