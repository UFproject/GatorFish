describe('Product Detail Page', () => {
    it('can view a product page', () => {
        cy.visit('/item?id=1');
        cy.contains('Contact Seller').should('be.visible');
    });

    it('shows product information', () => {
        cy.visit('/item?id=1');
        cy.get('img').should('be.visible');
        cy.contains('$').should('be.visible');
    });

    it('can navigate back to homepage', () => {
        cy.visit('/item?id=1');
        cy.contains('GATOR FISH MARKET').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
}); 