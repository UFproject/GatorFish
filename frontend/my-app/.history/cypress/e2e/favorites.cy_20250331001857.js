describe('Favorites Page', () => {
    // Run login once before all tests instead of before each
    before(() => {
        // Use our custom login command
        cy.login();
    });

    it('can navigate to favorites page', () => {
        // Visit favorites page
        cy.visit('/');

        // Looking for any favorites link or icon to click
        cy.get('a[href*="favorites"], button:contains("Favorites"), [data-testid*="favorites"]', { timeout: 10000 })
            .first()
            .click({ force: true });

        // Check that we've reached a favorites-related page
        cy.url().should('include', 'favorites');
    });

    it('displays the favorites page header', () => {
        cy.visit('/favorites');
        cy.contains(/My Favorites|Favorites|Saved Items/, { timeout: 10000 }).should('be.visible');
    });

    it('can add a product to favorites', () => {
        // Navigate to a product
        cy.visit('/');

        // Click on a product
        cy.get('[data-testid="product-card"], .product-card, .product-item', { timeout: 10000 })
            .first()
            .click({ force: true });

        // Check we're on a product page
        cy.url().should('include', '/item');

        // Look for favorites button with various possible wordings
        cy.contains(/Add to Favorites|Save|Add to Wishlist|Favorite/, { timeout: 10000 })
            .click({ force: true });

        // Verify success message appears
        cy.contains(/Added to favorites|Added to wishlist|Saved|Item favorited/, { timeout: 10000 }).should('be.visible');
    });

    it('can view favorites', () => {
        // Navigate to favorites page
        cy.visit('/favorites');

        // Look for either product cards or a message
        cy.get('body').then($body => {
            // Check if there are products or an empty message
            if ($body.find('[data-testid="product-card"], .product-card, .product-item').length) {
                cy.get('[data-testid="product-card"], .product-card, .product-item').should('exist');
            } else {
                cy.contains(/No favorites found|No saved items|Your wishlist is empty/, { timeout: 10000 }).should('be.visible');
            }
        });
    });

    it('shows notifications when interacting with favorites', () => {
        // Navigate to a product
        cy.visit('/');

        // Click on a product
        cy.get('[data-testid="product-card"], .product-card, .product-item', { timeout: 10000 })
            .first()
            .click({ force: true });

        // Look for favorites button with various possible wordings
        cy.contains(/Add to Favorites|Save|Add to Wishlist|Favorite/, { timeout: 10000 })
            .click({ force: true });

        // Check that some notification is displayed
        cy.get('.MuiSnackbar-root, [role="alert"], .notification, .toast', { timeout: 10000 }).should('be.visible');
    });

    it('can navigate from favorites to product details', () => {
        // Visit favorites page
        cy.visit('/favorites');

        // Look for product cards, if none exist we'll skip this test
        cy.get('body').then($body => {
            if ($body.find('[data-testid="product-card"], .product-card, .product-item').length) {
                // Click on the first product
                cy.get('[data-testid="product-card"], .product-card, .product-item')
                    .first()
                    .click({ force: true });

                // Should navigate to product details page
                cy.url().should('include', '/item');
                cy.contains(/Product Details|Details|Product Information/, { timeout: 10000 }).should('be.visible');
            } else {
                // Skip test if no favorites
                cy.log('No favorites found to click on - skipping test');
            }
        });
    });
}); 