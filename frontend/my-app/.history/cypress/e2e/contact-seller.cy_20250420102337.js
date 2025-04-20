describe('Contact Seller Functionality', () => {
    beforeEach(() => {
        // Visit a product page
        cy.visit('/');
        cy.get('[data-testid="product-card"], .product-card, .product-item')
            .first()
            .click({ force: true });
    });

    it('can open contact seller dialog', () => {
        // Click contact seller button
        cy.contains('Contact Seller').click();

        // Dialog should be visible
        cy.get('.MuiDialog-root').should('be.visible');
        cy.contains('Seller Info').should('be.visible');
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
        cy.contains('Contact Seller').click();

        // Wait for API call and check content
        cy.wait('@getProfile');
        cy.contains('Test Seller').should('be.visible');
        cy.contains('test@example.com').should('be.visible');
        cy.contains('123-456-7890').should('be.visible');
    });

    it('can close contact seller dialog', () => {
        // Open dialog
        cy.contains('Contact Seller').click();

        // Close dialog
        cy.contains('Close').click();

        // Dialog should be closed
        cy.get('.MuiDialog-root').should('not.exist');
    });

    it('contact seller button has correct styling', () => {
        cy.contains('Contact Seller')
            .should('have.css', 'background-color', 'rgb(0, 33, 165)') // #0021A5
            .and('have.css', 'width', 'calc(50% - 4px)');
    });

    it('dialog has correct layout and styling', () => {
        // Open dialog
        cy.contains('Contact Seller').click();

        // Check dialog styling
        cy.get('.MuiDialog-paper')
            .should('be.visible')
            .and('have.css', 'border-radius', '4px');

        // Check content layout
        cy.get('.MuiDialogContent-root')
            .should('be.visible')
            .within(() => {
                cy.get('.MuiGrid-container').should('have.length.at.least', 3); // At least 3 info rows
            });
    });
}); 