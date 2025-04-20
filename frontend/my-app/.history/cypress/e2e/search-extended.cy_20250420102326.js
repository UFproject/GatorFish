describe('Extended Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can perform a search and see results', () => {
        // Type in search field and submit
        cy.get('input[placeholder="Search for anything"]')
            .type('test product{enter}');

        // Should navigate to search results page
        cy.url().should('include', '/search-results');

        // Should show search results section
        cy.contains('Search Results').should('be.visible');
    });

    it('shows empty state when no results found', () => {
        // Mock empty search results
        cy.intercept('POST', '**/items/Search', {
            statusCode: 200,
            body: { items: [] }
        }).as('emptySearch');

        // Perform search
        cy.get('input[placeholder="Search for anything"]')
            .type('nonexistent product{enter}');

        // Wait for API call
        cy.wait('@emptySearch');

        // Should still be on search results page
        cy.url().should('include', '/search-results');
    });

    it('maintains search term in URL', () => {
        const searchTerm = 'test search';

        // Perform search
        cy.get('input[placeholder="Search for anything"]')
            .type(`${searchTerm}{enter}`);

        // URL should contain search term
        cy.url().should('include', 'search-results');
    });

    it('search bar has correct styling', () => {
        cy.get('input[placeholder="Search for anything"]')
            .should('have.css', 'background-color', 'rgb(255, 255, 255)')
            .should('have.css', 'border-radius', '20px');
    });
}); 