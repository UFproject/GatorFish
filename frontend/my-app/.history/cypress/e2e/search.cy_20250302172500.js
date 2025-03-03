describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can search for products', () => {
        cy.get('input[placeholder="Search for anything"]').type('basketball{enter}');
        cy.url().should('include', 'search');
    });

    it('shows search term in URL', () => {
        cy.get('input[placeholder="Search for anything"]').type('desk{enter}');
        cy.url().should('include', 'desk');
    });

    it('shows "no results" message for invalid search', () => {
        cy.get('input[placeholder="Search for anything"]').type('xyznonexistentproduct{enter}');

        cy.contains('No results found').should('be.visible');
    });

    it('maintains search term in search bar after search', () => {
        const searchTerm = 'desk';
        cy.get('input[placeholder="Search for anything"]').type(`${searchTerm}{enter}`);

        // After navigation, search term should still be in input
        cy.get('input[placeholder="Search for anything"]').should('have.value', searchTerm);
    });

    it('shows search suggestions while typing', () => {
        cy.get('input[placeholder="Search for anything"]').type('i');

        // Should show suggestions dropdown
        cy.contains('iPhone').should('be.visible');
    });
}); 