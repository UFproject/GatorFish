describe('Category Page', () => {
    it('displays products for Electronics category', () => {
        cy.visit('/category/Electronics');

        cy.contains('h1', 'Electronics').should('be.visible');
        cy.get('a[href^="/item"]').should('have.length.at.least', 1);
    });

    it('displays products for Fashion category', () => {
        cy.visit('/category/Fashion');

        cy.contains('h1', 'Fashion').should('be.visible');
        cy.get('a[href^="/item"]').should('have.length.at.least', 1);
    });

    it('shows filtering options', () => {
        cy.visit('/category/Electronics');

        cy.contains('Filter').should('be.visible');
        cy.contains('Sort by').should('be.visible');
    });

    it('applies price filter', () => {
        cy.visit('/category/Electronics');

        // Open filter dialog
        cy.contains('Filter').click();

        // Set price range
        cy.get('input[aria-label="Min price"]').type('10');
        cy.get('input[aria-label="Max price"]').type('500');
        cy.contains('Apply').click();

        // URL should contain filter parameters
        cy.url().should('include', 'minPrice=10');
        cy.url().should('include', 'maxPrice=500');
    });
}); 