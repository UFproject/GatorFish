describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays header and navigation', () => {
        cy.contains('GATOR FISH MARKET').should('be.visible');
        cy.get('input[placeholder="Search for anything"]').should('be.visible');
        cy.contains('Sign In').should('be.visible');
    });

    it('shows category menu with all categories', () => {
        cy.contains('Phones/Digital/Computers').should('be.visible');
        cy.contains('Fashion/Bags/Sports').should('be.visible');
        cy.contains('Baby/Beauty/Personal Care').should('be.visible');
        cy.contains('Home/Appliances/Furniture').should('be.visible');
        cy.contains('Collectibles/Jewelry/Gifts').should('be.visible');
        cy.contains('Food/Pets/Flowers').should('be.visible');
        cy.contains('Books/Games/Media').should('be.visible');
        cy.contains('Cars/E-vehicles/Rentals').should('be.visible');
    });

    it('displays featured sections with correct titles', () => {
        cy.contains('Fashion Refresh').should('be.visible');
        cy.contains('Digital Devices').should('be.visible');
        cy.contains('Sports Equipment').should('be.visible');
    });

    it('displays product cards with images and prices', () => {
        // Wait for products to load
        cy.get('a[href^="/item"]').should('have.length.at.least', 1);
        
        // Check that first product has the expected elements
        cy.get('a[href^="/item"]').first().within(() => {
            cy.get('img').should('be.visible');
            cy.get('div').contains('$').should('be.visible');
        });
    });

    it('navigates to product detail page when clicking on a product', () => {
        cy.get('a[href^="/item"]').first().click();
        cy.url().should('include', '/item');
    });

    it('shows "See All" buttons for featured sections', () => {
        cy.contains('See All').should('be.visible');
    });

    it('performs search when typing and pressing Enter', () => {
        cy.get('input[placeholder="Search for anything"]').type('basketball{enter}');
        cy.url().should('include', 'search');
    });
}); 