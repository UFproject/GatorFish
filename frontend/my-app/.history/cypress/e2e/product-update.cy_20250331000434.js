describe('Product Update', () => {
    // Mock user login before testing product updating
    beforeEach(() => {
        // Login as a seller using our custom command
        cy.loginAsSeller();

        // Mock product update endpoints
        cy.intercept('PUT', '**/products/*', {
            statusCode: 200,
            body: {
                message: 'Product updated successfully',
                product: {
                    id: 1,
                    title: 'Updated Product Title',
                    price: 99.99,
                    description: 'This is an updated product description for testing purposes.',
                    category: 'Phones/Digital/Computers',
                    seller: 'Test Seller',
                    sellerID: 123
                }
            }
        }).as('updateProduct');
    });

    it('can access the Edit Products page', () => {
        // Visit the Edit Products page
        cy.visit('/edit-products');
        cy.wait('@getProducts');

        // Verify page loads properly
        cy.contains('Edit Your Products').should('be.visible');
    });

    it('displays seller\'s products in the list', () => {
        cy.visit('/edit-products');
        cy.wait('@getProducts');

        // Verify that at least one product card exists
        cy.getByTestId('product-card').should('exist');

        // Check that each product has edit button
        cy.getByTestId('product-card').first().find('[data-testid="edit-button"]').should('exist');
    });

    it('can navigate to update product form', () => {
        cy.visit('/edit-products');
        cy.wait('@getProducts');

        // Click the edit button on the first product
        cy.getByTestId('edit-button').first().click();

        // Verify that the update form is displayed
        cy.contains('Update Product').should('be.visible');
        cy.get('form').should('exist');
    });

    it('can update product details', () => {
        // Visit the product update page directly (with a known ID)
        cy.visit('/update-product/1');
        cy.wait('@getProductById');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Clear and update the title field
        cy.get('input[name="title"]').clear().type('Updated Product Title');

        // Clear and update the price field
        cy.get('input[name="price"]').clear().type('99.99');

        // Clear and update the description field
        cy.get('textarea[name="description"]').clear().type('This is an updated product description for testing purposes.');

        // Submit the form
        cy.get('button[type="submit"]').click();
        cy.wait('@updateProduct');

        // Verify success message
        cy.contains('Product updated successfully', { timeout: 5000 }).should('be.visible');

        // Verify redirect to Edit Products page
        cy.url().should('include', '/edit-products');
    });

    it('displays validation errors for invalid inputs', () => {
        cy.visit('/update-product/1');
        cy.wait('@getProductById');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Clear the title (required field)
        cy.get('input[name="title"]').clear();

        // Enter invalid price
        cy.get('input[name="price"]').clear().type('-10');

        // Try to submit the form
        cy.get('button[type="submit"]').click();

        // Verify error messages are displayed
        cy.contains('Title is required').should('be.visible');
        cy.contains('Price must be a positive number').should('be.visible');
    });

    it('has a cancel button that returns to Edit Products page', () => {
        cy.visit('/update-product/1');
        cy.wait('@getProductById');

        // Wait for form to load
        cy.get('form', { timeout: 10000 }).should('exist');

        // Click the cancel button
        cy.contains('Cancel').click();

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

        // Check for loading indicator (using common patterns)
        cy.get('[role="progressbar"], .loading-spinner, [data-testid="loading-indicator"]', { timeout: 3000 }).should('be.visible');

        // Wait for the delayed request to complete
        cy.wait('@delayedProductData');

        // Eventually the form should appear
        cy.get('form', { timeout: 5000 }).should('be.visible');
    });
}); 