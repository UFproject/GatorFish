describe('Homepage Extended Features', () => {
    beforeEach(() => {
        // Start by visiting the homepage
        cy.visit('/');
    });

    it('displays featured sections for each category', () => {
        // Check that each of the three main category sections is visible
        cy.contains('h2', 'Phones/Digital/Computers').should('be.visible');
        cy.contains('h2', 'Fashion/Bags/Sports').should('be.visible');
        cy.contains('h2', 'Baby/Beauty/Personal Care').should('be.visible');
    });

    it('loads product cards in each featured section', () => {
        // Check that product cards exist in the first section
        cy.contains('h2', 'Phones/Digital/Computers')
            .closest('section')
            .find('.product-card')
            .should('have.length.at.least', 1);

        // Check product cards in the second section  
        cy.contains('h2', 'Fashion/Bags/Sports')
            .closest('section')
            .find('.product-card')
            .should('have.length.at.least', 1);

        // Check product cards in the third section
        cy.contains('h2', 'Baby/Beauty/Personal Care')
            .closest('section')
            .find('.product-card')
            .should('have.length.at.least', 1);
    });

    it('shows login success notification when coming from login page', () => {
        // Visit login page
        cy.visit('/login');

        // Fill in login credentials
        cy.get('input[placeholder="username"]').type('testuser');
        cy.get('input[type="password"]').type('password123');

        // Submit the form
        cy.get('button').contains('Sign in').click();

        // Should redirect to homepage
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Should show login success notification
        cy.contains('Login Successful!').should('be.visible');
    });

    it('can navigate to a product detail page from featured section', () => {
        // Click on the first product card in the first featured section
        cy.contains('h2', 'Phones/Digital/Computers')
            .closest('section')
            .find('.product-card')
            .first()
            .click();

        // Should navigate to product detail page
        cy.url().should('include', '/item?id=');
    });

    it('can navigate to view all products in a category', () => {
        // Click "View All" button in the first featured section
        cy.contains('h2', 'Phones/Digital/Computers')
            .closest('section')
            .contains('View All')
            .click();

        // Should navigate to category page
        cy.url().should('include', '/category?category_name=Phones/Digital/Computers');
    });

    it('shows seller name on product cards', () => {
        // Check that seller name is visible on product cards
        cy.contains('h2', 'Phones/Digital/Computers')
            .closest('section')
            .find('.product-card')
            .first()
            .contains('Sold by:')
            .should('be.visible');
    });

    it('has functioning category menu', () => {
        // Click on a category in the sidebar menu
        cy.contains('Fashion/Bags/Sports').click();

        // Should navigate to category page
        cy.url().should('include', '/category?category_name=Fashion/Bags/Sports');
    });

    it('displays loading state while fetching items', () => {
        // Intercept API requests and delay them to see loading state
        cy.intercept('/items/Category*', (req) => {
            req.on('response', (res) => {
                res.setDelay(1000);
            });
        });

        // Reload the page to trigger the loading state
        cy.reload();

        // Check for loading indicators
        cy.get('[data-testid="loading-indicator"]').should('be.visible');

        // Eventually products should load
        cy.contains('h2', 'Phones/Digital/Computers')
            .closest('section')
            .find('.product-card')
            .should('be.visible');
    });
}); 