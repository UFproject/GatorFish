describe('Category Page', () => {
    it('can view Electronics category', () => {
        cy.visit('/category/Electronics');
        cy.contains('Electronics').should('be.visible');
    });

    it('can view Fashion category', () => {
        cy.visit('/category/Fashion');
        cy.contains('Fashion').should('be.visible');
    });

    it('shows filtering options', () => {
        cy.visit('/category/Electronics');
        cy.contains('Filter').should('be.visible');
    });
}); 