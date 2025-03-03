describe('Product Detail Page', () => {
    it('can visit a product page', () => {
        cy.visit('/item?id=1');
    });

    it('shows product image', () => {
        cy.visit('/item?id=1');
        cy.get('img').should('exist');
    });

    it('can navigate using browser back', () => {
        cy.visit('/');
        cy.visit('/item?id=1');
        cy.go('back');
        cy.contains('GATOR FISH MARKET').should('be.visible');
    });
}); 