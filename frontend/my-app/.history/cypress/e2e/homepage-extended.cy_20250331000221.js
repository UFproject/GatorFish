describe('Homepage Extended Features', () => {
    beforeEach(() => {
        // Start by visiting the homepage
        cy.visit('/');
        // Wait for content to load
        cy.contains('h2', /Phones|Fashion|Baby/, { timeout: 10000 }).should('be.visible');
    });

    it('displays featured sections for each category', () => {
        // Check that category sections are visible (using partial matches for flexibility)
        cy.contains('h2', /Phones/).should('be.visible');
        cy.contains('h2', /Fashion/).should('be.visible');
        cy.contains('h2', /Baby|Beauty/).should('be.visible');
    });

    it('loads product cards in each featured section', () => {
        // First check if sections exist 
        cy.contains('h2', /Phones/).as('phonesSection');
        cy.contains('h2', /Fashion/).as('fashionSection');
        cy.contains('h2', /Baby|Beauty/).as('beautySection');

        // Check for product cards - using parent() to go up from the h2 to the section
        cy.get('@phonesSection').parent().find('[data-testid="product-card"]').should('have.length.at.least', 1);
        cy.get('@fashionSection').parent().find('[data-testid="product-card"]').should('have.length.at.least', 1);
        cy.get('@beautySection').parent().find('[data-testid="product-card"]').should('have.length.at.least', 1);
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
        // Find a product card and click it
        cy.get('[data-testid="product-card"]').first().click();

        // Should navigate to product detail page
        cy.url().should('include', '/item?id=');
    });

    it('can navigate to view all products in a category', () => {
        // Find a "View All" link and click it
        cy.contains('View All').first().click();

        // Should navigate to category page
        cy.url().should('include', '/category?category_name=');
    });

    it('shows seller name on product cards', () => {
        // Check that seller name is visible on product cards
        cy.get('[data-testid="product-card"]').first()
            .contains(/Sold by|Seller:/)
            .should('be.visible');
    });

    it('has functioning category menu', () => {
        // Wait for category menu to be fully loaded
        cy.contains(/Categories|Browse Categories/, { timeout: 5000 }).should('be.visible');

        // Look for any category link and click it
        cy.contains(/Fashion|Phones|Baby/).first().click();

        // Should navigate to category page
        cy.url().should('include', '/category?category_name=');
    });

    it('displays loading state while fetching items', () => {
        // Intercept any API requests to items/products endpoints
        cy.intercept('GET', '**/items/**').as('itemsRequest');
        cy.intercept('GET', '**/products/**').as('productsRequest');

        // Reload the page with network conditions that will show loading state
        cy.reload();

        // Look for any loading indicators using common patterns
        cy.get('[role="progressbar"], .MuiCircularProgress-root, .loading, .spinner', { timeout: 5000 })
            .should('exist');

        // Eventually product cards should be visible
        cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('be.visible');
    });
}); 