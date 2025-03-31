describe('Favorites Page', () => {
    // Mock user login before testing favorites
    beforeEach(() => {
        // Login through UI instead of API call
        cy.visit('/login');
        cy.get('input[placeholder="username"]').type('testuser');
        cy.get('input[type="password"]').type('password123');
        cy.get('button').contains('Sign in').click();

        // Give time for login to complete and redirect
        cy.url().should('not.include', '/login');

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

        // Verify success message appears (with timeout to ensure it loads)
        cy.contains('Added to favorites', { timeout: 5000 }).should('be.visible');

        // Navigate to favorites page
        cy.visit('/favorites');

        // Verify product appears in favorites
        cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    });

    it('can remove a product from favorites', () => {
        // First add a product to favorites
        cy.visit('/item?id=1');
        cy.contains('Add to Favorites').click();
        cy.contains('Added to favorites', { timeout: 5000 });

        // Navigate to favorites page
        cy.visit('/favorites');

        // Click remove button
        cy.contains('Remove').click();

        // Verify product is removed (give it time to update)
        cy.contains('No favorites found', { timeout: 5000 }).should('be.visible');
    });

    it('shows Snackbar notification when adding to favorites', () => {
        // Navigate to a product
        cy.visit('/item?id=1');

        // Click the "Add to Favorites" button
        cy.contains('Add to Favorites').click();

        // Check that Snackbar notification is displayed
        cy.get('.MuiSnackbar-root', { timeout: 5000 }).should('be.visible');
        cy.contains('Added to favorites').should('be.visible');
    });

    it('shows error notification when trying to add duplicate to favorites', () => {
        // Navigate to a product and add it
        cy.visit('/item?id=1');
        cy.contains('Add to Favorites').click();
        cy.contains('Added to favorites', { timeout: 5000 });

        // Try to add the same item again
        cy.contains('Add to Favorites').click();

        // Should show error notification
        cy.get('.MuiSnackbar-root', { timeout: 5000 }).should('be.visible');
        cy.contains('Item already in favorites').should('be.visible');
    });

    it('navigates from favorites back to product details', () => {
        // First add a product to favorites
        cy.visit('/item?id=1');
        cy.contains('Add to Favorites').click();
        cy.contains('Added to favorites', { timeout: 5000 });

        // Navigate to favorites page
        cy.visit('/favorites');

        // Click on a product card to view details
        cy.get('[data-testid="product-card"]').first().click();

        // Should navigate to product details page
        cy.url().should('include', '/item?id=');
        cy.contains('Product Details').should('be.visible');
    });
}); 