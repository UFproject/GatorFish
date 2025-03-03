describe('Category Page', () => {
    it('can visit a category page', () => {
        cy.visit('/category/Phones');
    });

    it('displays products on category page', () => {
        cy.visit('/category/Phones');
        cy.get('img').should('exist');
    });
}); 