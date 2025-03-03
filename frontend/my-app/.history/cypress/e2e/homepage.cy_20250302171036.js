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
    });

    it('displays featured sections', () => {
        cy.contains('Fashion Refresh').should('be.visible');
        cy.contains('Digital Devices').should('be.visible');
        cy.contains('Sports Equipment').should('be.visible');
    });

    it('displays product cards with correct information', () => {
        // Wait for products to load
        cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.gt', 0);

        // Test first product card
        cy.get('[data-testid="product-card"]').first().within(() => {
            cy.get('img').should('be.visible');
            cy.get('[data-testid="product-title"]').should('not.be.empty');
            cy.get('[data-testid="product-price"]').should('contain', '$');
            cy.get('[data-testid="seller-name"]').should('not.be.empty');
        });
    });
}); 