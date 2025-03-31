describe('Favorites Page', () => {
    // Mock user login before testing favorites
    beforeEach(() => {
        // Use our custom login command
        cy.login();

        // Visit favorites page
        cy.visit('/favorites');
    });

    it('displays the favorites page header', () => {
        cy.contains('My Favorites').should('be.visible');
    });

    it('shows message when no favorites exist', () => {
        // Override the default mock to return empty favorites
        cy.intercept('GET', '**/favorites*', {
            statusCode: 200,
            body: []
        }).as('emptyFavorites');

        // Reload to trigger the new mock
        cy.reload();
        cy.wait('@emptyFavorites');

        // This assumes there's a message shown when favorites are empty
        cy.contains('No favorites found').should('be.visible');
    });

    it('can add a product to favorites', () => {
        // Navigate to a product
        cy.visit('/item?id=1');
        cy.wait('@getProductById');

        // Click the "Add to Favorites" button
        cy.contains('Add to Favorites').click();
        cy.wait('@addToFavorites');

        // Verify success message appears
        cy.contains('Added to favorites', { timeout: 5000 }).should('be.visible');

        // Navigate to favorites page
        cy.visit('/favorites');
        cy.wait('@getFavorites');

        // Verify product appears in favorites
        cy.getByTestId('product-card').should('have.length.at.least', 1);
    });

    it('can remove a product from favorites', () => {
        // Set up mocks for removing from favorites
        cy.intercept('DELETE', '**/favorites/*', {
            statusCode: 200,
            body: { message: 'Removed from favorites' }
        }).as('removeFavorite');

        // Mock favorites to have items first
        cy.visit('/favorites');
        cy.wait('@getFavorites');

        // Then mock the GET to return empty after removal
        cy.intercept('GET', '**/favorites*', {
            statusCode: 200,
            body: []
        }).as('emptyFavorites');

        // Click remove button
        cy.contains('Remove').click();
        cy.wait('@removeFavorite');

        // Mock the reload after removal
        cy.wait('@emptyFavorites');

        // Verify product is removed
        cy.contains('No favorites found', { timeout: 5000 }).should('be.visible');
    });

    it('shows Snackbar notification when adding to favorites', () => {
        // Navigate to a product
        cy.visit('/item?id=1');
        cy.wait('@getProductById');

        // Click the "Add to Favorites" button
        cy.contains('Add to Favorites').click();
        cy.wait('@addToFavorites');

        // Check that Snackbar notification is displayed
        cy.get('.MuiSnackbar-root, [role="alert"]', { timeout: 5000 }).should('be.visible');
        cy.contains('Added to favorites').should('be.visible');
    });

    it('shows error notification when trying to add duplicate to favorites', () => {
        // Mock error response for duplicate
        cy.intercept('POST', '**/favorites*', {
            statusCode: 400,
            body: { message: 'Item already in favorites' }
        }).as('duplicateFavorite');

        // Navigate to a product
        cy.visit('/item?id=1');
        cy.wait('@getProductById');

        // Click the "Add to Favorites" button
        cy.contains('Add to Favorites').click();
        cy.wait('@duplicateFavorite');

        // Should show error notification
        cy.get('.MuiSnackbar-root, [role="alert"]', { timeout: 5000 }).should('be.visible');
        cy.contains('Item already in favorites').should('be.visible');
    });

    it('navigates from favorites back to product details', () => {
        // Visit favorites page with mock data
        cy.visit('/favorites');
        cy.wait('@getFavorites');

        // Click on a product card to view details
        cy.getByTestId('product-card').first().click();

        // Should navigate to product details page
        cy.url().should('include', '/item?id=');
        cy.contains('Product Details').should('be.visible');
    });
}); 