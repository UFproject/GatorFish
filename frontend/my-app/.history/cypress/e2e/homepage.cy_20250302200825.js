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

    it('displays category menu', () => {
        cy.contains('Phones/Digital/Computers').should('be.visible');
    });

    it('can enter text in search field', () => {
        cy.get('input[placeholder="Search for anything"]').type('test');
    });
}); 