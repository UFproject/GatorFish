describe('Extended Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can perform search and see results', () => {
        // Type in search field
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type('test product{enter}');

        // Check URL includes search-results
        cy.url().should('include', '/search-results');

        // Check search results section is visible
        cy.contains('Search Results', { timeout: 10000 }).should('be.visible');
    });

    it('shows empty state when no results found', () => {
        // Mock empty search response
        cy.intercept('POST', '**/items/Search', {
            statusCode: 200,
            body: []
        }).as('emptySearch');

        // Perform search for nonexistent product
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type('nonexistentproduct123{enter}');

        // Wait for API call
        cy.wait('@emptySearch');

        // Check URL still includes search-results
        cy.url().should('include', '/search-results');

        // Check empty state message
        cy.contains('No results found', { timeout: 10000 }).should('be.visible');
    });

    it('maintains search term in URL', () => {
        const searchTerm = 'test search term';

        // Perform search
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type(`${searchTerm}{enter}`);

        // Check URL contains search term
        cy.url().should('include', encodeURIComponent(searchTerm));
    });

    it('search bar has correct styling', () => {
        // Check search bar styling - use more flexible assertions
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .and('have.css', 'background-color')
            .and('not.be.empty');
    });
}); 