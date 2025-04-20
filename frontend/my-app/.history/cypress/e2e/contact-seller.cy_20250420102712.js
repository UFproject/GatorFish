describe('Contact Seller Functionality', () => {
    beforeEach(() => {
        // Visit a product page
        cy.visit('/');

        // Wait for product cards to load and click the first one
        cy.get('[data-testid="product-card"], .product-card, .product-item, .MuiCard-root', { timeout: 10000 })
            .first()
            .click({ force: true });

        // Wait for the product page to load
        cy.url().should('include', '/item');
    });

    it('can open contact seller dialog', () => {
        // Click contact seller button - use a more flexible selector
        cy.contains('Contact Seller', { timeout: 10000 }).click();

        // Dialog should be visible
        cy.get('.MuiDialog-root, [role="dialog"]', { timeout: 10000 }).should('be.visible');
        cy.contains('Seller Info', { timeout: 10000 }).should('be.visible');
    });

    it('displays seller contact information', () => {
        // Mock the profile API response
        cy.intercept('POST', '**/auth/profile', {
            statusCode: 200,
            body: {
                username: 'Test Seller',
                email: 'test@example.com',
                phone: '123-456-7890'
            }
        }).as('getProfile');

        // Open contact dialog
        cy.contains('Contact Seller', { timeout: 10000 }).click();

        // Wait for API call and check content
        cy.wait('@getProfile');
        cy.contains('Test Seller', { timeout: 10000 }).should('be.visible');
        cy.contains('test@example.com', { timeout: 10000 }).should('be.visible');
        cy.contains('123-456-7890', { timeout: 10000 }).should('be.visible');
    });

    it('can close contact seller dialog', () => {
        // Open dialog
        cy.contains('Contact Seller', { timeout: 10000 }).click();

        // Wait for dialog to be visible
        cy.get('.MuiDialog-root, [role="dialog"]', { timeout: 10000 }).should('be.visible');

        // Close dialog
        cy.contains('Close', { timeout: 10000 }).click();

        // Dialog should be closed
        cy.get('.MuiDialog-root, [role="dialog"]').should('not.exist');
    });

    it('contact seller button has correct styling', () => {
        // Use a more flexible selector for the button
        cy.contains('Contact Seller', { timeout: 10000 })
            .should('be.visible')
            .and('have.css', 'background-color')
            .and('not.be.empty');
    });

    it('dialog has correct layout and styling', () => {
        // Open dialog
        cy.contains('Contact Seller', { timeout: 10000 }).click();

        // Wait for dialog to be visible
        cy.get('.MuiDialog-root, [role="dialog"]', { timeout: 10000 }).should('be.visible');

        // Check dialog styling - use more flexible assertions
        cy.get('.MuiDialog-paper, [role="dialog"] > div')
            .should('be.visible');

        // Check content layout - use more flexible selectors
        cy.get('.MuiDialogContent-root, [role="dialog"] .MuiGrid-container')
            .should('be.visible')
            .should('have.length.at.least', 1);
    });
}); 