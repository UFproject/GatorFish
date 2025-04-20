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
}); 