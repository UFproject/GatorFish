describe('Favorites Page', () => {
    // Mock user login before testing favorites
    beforeEach(() => {
        // Login first (using cy.request instead of UI to save time)
        cy.request({
            method: 'POST',
            url: '/auth/login',
            body: {
                Username: 'testuser',
                Password: 'password123'
            }
        }).then((resp) => {
            // Save token to localStorage
            window.localStorage.setItem('token_key', resp.body.token);
        });

        // Visit favorites page
        cy.visit('/favorites');
    });

    it('displays the favorites page header', () => {
        cy.contains('My Favorites').should('be.visible');
    });

    it('shows message when no favorites exist', () => {
        // This assumes there's a message shown when favorites are empty
        cy.contains('No favorites found').should('be.visible');
    });

    it('can add a product to favorites', () => {
        // Navigate to a product
        cy.visit('/item?id=1');

        // Click the "Add to Favorites" button
        cy.contains('Add to Favorites').click();

        // Verify success message appears
        cy.contains('Added to favorites').should('be.visible');

        // Navigate to favorites page
        cy.visit('/favorites');

        // Verify product appears in favorites
        cy.get('.product-card').should('have.length.at.least', 1);
    });

    it('can remove a product from favorites', () => {
        // First add a product to favorites
        cy.visit('/item?id=1');
        cy.contains('Add to Favorites').click();

        // Navigate to favorites page
        cy.visit('/favorites');

        // Click remove button
        cy.contains('Remove').click();

        // Verify product is removed
        cy.contains('No favorites found').should('be.visible');
    });
}); 