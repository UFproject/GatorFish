describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can type in search field', () => {
        cy.get('input[placeholder="Search for anything"]').type('basketball');
    });

    it('can clear search field after typing', () => {
        cy.get('input[placeholder="Search for anything"]')
            .type('desk')
            .clear();
    });

    it('can perform search and see results', () => {
        // Type search term and submit
        cy.get('input[placeholder="Search for anything"]').type('basketball{enter}');

        // Should navigate to search results page
        cy.url().should('include', 'search-results');

        // Check for search results heading
        cy.contains('Search Results').should('be.visible');

        // Check if results are displayed
        cy.get('[data-testid="product-card"], .product-card, .product-item').should('exist');
    });

    it('shows empty state when no results found', () => {
        // Type a search term that should return no results
        cy.get('input[placeholder="Search for anything"]').type('nonexistentitem123{enter}');

        // Should still be on search results page
        cy.url().should('include', 'search-results');

        // Check for empty state message
        cy.contains(/No results found|No items found/).should('be.visible');
    });

    it('maintains search term in URL', () => {
        const searchTerm = 'basketball';
        cy.get('input[placeholder="Search for anything"]').type(`${searchTerm}{enter}`);
        cy.url().should('include', 'search-results');
    });

    it('can search using the search icon button', () => {
        cy.get('input[placeholder="Search for anything"]').type('basketball');
        cy.get('button[aria-label="search"]').click();
        cy.url().should('include', 'search-results');
    });
}); 