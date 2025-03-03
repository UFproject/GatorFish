describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays header and navigation', () => {
        cy.contains('GATOR FISH MARKET').should('be.visible');
        cy.get('input[placeholder="Search for anything"]').should('be.visible');
        cy.contains('Sign In').should('be.visible');
    });

    it('shows category menu', () => {
        cy.contains('Phones/Digital/Computers').should('be.visible');
        cy.contains('Fashion/Bags/Sports').should('be.visible');
        cy.contains('Baby/Beauty/Personal Care').should('be.visible');
    });

    it('displays featured sections', () => {
        cy.contains('Fashion Refresh').should('be.visible');
        cy.contains('Digital Devices').should('be.visible');
        cy.contains('Sports Equipment').should('be.visible');
    });
}); 