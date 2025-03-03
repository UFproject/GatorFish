describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays header with market name', () => {
        cy.contains('GATOR FISH MARKET').should('be.visible');
    });

    it('has search input field', () => {
        cy.get('input[placeholder="Search for anything"]').should('be.visible');
    });

    it('shows sign in button', () => {
        cy.contains('Sign In').should('be.visible');
    });

    it('can click on a category', () => {
        cy.contains('Phones/Digital/Computers').click();
        cy.url().should('include', 'category');
    });

    it('can search for products', () => {
        cy.get('input[placeholder="Search for anything"]').type('test{enter}');
        cy.url().should('include', 'search');
    });
}); 