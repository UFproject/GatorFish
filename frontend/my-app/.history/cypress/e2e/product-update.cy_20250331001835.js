describe('Product Update', () => {
    // Mock user login before testing product updating
    beforeEach(() => {
        // Login as a user with seller privileges
        cy.login();
    });

    it('can access the Edit Products page', () => {
        // Visit the Edit Products page
        cy.visit('/edit-products');

        // Verify page loads properly (without waiting for API)
        cy.contains('Edit Your Products', { timeout: 10000 }).should('be.visible');
    });

    it('displays seller\'s products in the list', () => {
        cy.visit('/edit-products');

        // Verify that at least one product card exists using a more flexible selector
        cy.get('[data-testid="product-card"], .product-card, .product-item', { timeout: 10000 }).should('exist');
    });

    it('can navigate to update product form', () => {
        cy.visit('/edit-products');

        // Click the edit button on the first product using a more flexible selector
        cy.get('[data-testid="edit-button"], .edit-button, button:contains("Edit")', { timeout: 10000 }).first().click();

        // Verify that the update form is displayed
        cy.contains('Update Product', { timeout: 10000 }).should('be.visible');
        cy.get('form').should('exist');
    });

    it('can update product details', () => {
        // Visit the product update page directly (with a known ID)
        cy.visit('/update-product/1');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Clear and update the title field
        cy.get('input[name="title"], input[placeholder*="title"]', { timeout: 10000 }).clear().type('Updated Product Title');

        // Clear and update the price field
        cy.get('input[name="price"], input[placeholder*="price"]', { timeout: 10000 }).clear().type('99.99');

        // Clear and update the description field
        cy.get('textarea[name="description"], textarea[placeholder*="description"]', { timeout: 10000 }).clear().type('This is an updated product description for testing purposes.');

        // Submit the form
        cy.get('button[type="submit"], button:contains("Update"), button:contains("Save")', { timeout: 10000 }).click();

        // Verify success message
        cy.contains('Product updated successfully', { timeout: 10000 }).should('be.visible');

        // Verify redirect to Edit Products page
        cy.url().should('include', '/edit-products');
    });

    it('displays validation errors for invalid inputs', () => {
        cy.visit('/update-product/1');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Clear the title (required field)
        cy.get('input[name="title"], input[placeholder*="title"]', { timeout: 10000 }).clear();

        // Enter invalid price
        cy.get('input[name="price"], input[placeholder*="price"]', { timeout: 10000 }).clear().type('-10');

        // Try to submit the form
        cy.get('button[type="submit"], button:contains("Update"), button:contains("Save")', { timeout: 10000 }).click();

        // Verify error messages are displayed with more flexible matchers
        cy.contains(/Title is required|Title cannot be empty/, { timeout: 10000 }).should('be.visible');
        cy.contains(/Price must be a positive number|Price must be greater than 0/, { timeout: 10000 }).should('be.visible');
    });

    it('has a cancel button that returns to Edit Products page', () => {
        cy.visit('/update-product/1');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Click the cancel button
        cy.contains('Cancel', { timeout: 10000 }).click();

        // Verify redirect to Edit Products page
        cy.url().should('include', '/edit-products');
    });

    it('shows loading state when fetching product data', () => {
        // Override the product API to add delay
        cy.intercept('GET', '**/products/*', (req) => {
            req.on('response', (res) => {
                res.setDelay(1000);
            });
        }).as('delayedProductData');

        // Visit product update page
        cy.visit('/update-product/1');

        // Checking for loading indicators with a large timeout for more reliability
        cy.get('[role="progressbar"], .loading-spinner, .loading, .spinner, [data-testid="loading"]', { timeout: 10000 }).should('exist');
    });
}); 