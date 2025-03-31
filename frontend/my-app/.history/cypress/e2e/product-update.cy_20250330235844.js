describe('Product Update', () => {
    // Mock user login before testing product updating
    beforeEach(() => {
        // Login as a seller (using cy.request to save time)
        cy.request({
            method: 'POST',
            url: '/auth/login',
            body: {
                Username: 'selleruser',
                Password: 'password123'
            }
        }).then((resp) => {
            // Save token to localStorage
            window.localStorage.setItem('token_key', resp.body.token);
        });
    });

    it('can access the Edit Products page', () => {
        // Visit the Edit Products page
        cy.visit('/edit-products');
        
        // Verify page loads properly
        cy.contains('Edit Your Products').should('be.visible');
    });

    it('displays seller\'s products in the list', () => {
        cy.visit('/edit-products');
        
        // Verify that at least one product card exists
        cy.get('.product-card').should('exist');
        
        // Check that each product has edit button
        cy.get('.product-card').first().find('[data-testid="edit-button"]').should('exist');
    });

    it('can navigate to update product form', () => {
        cy.visit('/edit-products');
        
        // Click the edit button on the first product
        cy.get('[data-testid="edit-button"]').first().click();
        
        // Verify that the update form is displayed
        cy.contains('Update Product').should('be.visible');
        cy.get('form').should('exist');
    });

    it('can update product details', () => {
        // Visit the product update page directly (with a known ID)
        cy.visit('/update-product/1');
        
        // Clear and update the title field
        cy.get('input[name="title"]').clear().type('Updated Product Title');
        
        // Clear and update the price field
        cy.get('input[name="price"]').clear().type('99.99');
        
        // Clear and update the description field
        cy.get('textarea[name="description"]').clear().type('This is an updated product description for testing purposes.');
        
        // Submit the form
        cy.get('button[type="submit"]').click();
        
        // Verify success message
        cy.contains('Product updated successfully').should('be.visible');
        
        // Verify redirect to Edit Products page
        cy.url().should('include', '/edit-products');
    });

    it('displays validation errors for invalid inputs', () => {
        cy.visit('/update-product/1');
        
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
        
        // Click the cancel button
        cy.contains('Cancel').click();
        
        // Verify redirect to Edit Products page
        cy.url().should('include', '/edit-products');
    });

    it('shows loading state when fetching product data', () => {
        // Intercept the API request to add a delay
        cy.intercept('GET', '/api/products/*', (req) => {
            req.on('response', (res) => {
                // Delay the response by 1 second
                res.setDelay(1000);
            });
        });
        
        // Visit product update page
        cy.visit('/update-product/1');
        
        // Check for loading indicator
        cy.get('[data-testid="loading-indicator"]').should('be.visible');
        
        // Eventually the form should appear
        cy.get('form').should('be.visible');
    });
}); 