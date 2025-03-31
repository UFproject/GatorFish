// Custom commands for Cypress tests

// Login command for reuse
Cypress.Commands.add('login', (username = Cypress.env('TEST_USERNAME'), password = Cypress.env('TEST_PASSWORD')) => {
    cy.visit('/login');
    cy.get('input[placeholder="username"], input[name="username"]').type(username);
    cy.get('input[type="password"], input[name="password"]').type(password);
    cy.get('button').contains(/Sign in|Login|Submit/).click();
    // Wait for redirect to confirm login success
    cy.url().should('not.include', '/login');
});

// Add data-testid attributes to elements for more reliable selection
Cypress.Commands.add('getByTestId', (testId) => {
    return cy.get(`[data-testid="${testId}"]`);
});

// Wait for loading state to be gone
Cypress.Commands.add('waitForLoadingToFinish', () => {
    // Try to find any common loading indicators and wait for them to disappear
    cy.get('body').then($body => {
        if ($body.find('[role="progressbar"], .loading, .MuiCircularProgress-root').length) {
            cy.get('[role="progressbar"], .loading, .MuiCircularProgress-root').should('not.exist');
        }
    });
});

// Skip waiting for API responses
Cypress.Commands.add('skipWaitingFor', (aliasName) => {
    cy.on('command:retry', (msg) => {
        if (msg.includes(`cy.wait() timed out waiting for the 1st request to the route: \`${aliasName}\``)) {
            return false; // Skip waiting for this route
        }
    });
});

// Mock all product API responses - but make them optional
Cypress.Commands.add('mockProductAPIs', (skipWaiting = true) => {
    if (!Cypress.env('MOCK_API')) return;

    // Mock fetch all products
    cy.intercept('GET', '**/products*', {
        statusCode: 200,
        body: [
            {
                id: 1,
                title: 'Test Product 1',
                description: 'This is a test product',
                price: 99.99,
                category: 'Phones/Digital/Computers',
                seller: 'Test Seller',
                sellerID: 123
            },
            {
                id: 2,
                title: 'Test Product 2',
                description: 'This is another test product',
                price: 149.99,
                category: 'Fashion/Bags/Sports',
                seller: 'Test Seller',
                sellerID: 123
            },
            {
                id: 3,
                title: 'Test Product 3',
                description: 'This is a third test product',
                price: 49.99,
                category: 'Baby/Beauty/Personal Care',
                seller: 'Another Seller',
                sellerID: 456
            }
        ]
    }).as('getProducts');

    // Mock fetch product by ID
    cy.intercept('GET', '**/products/*', {
        statusCode: 200,
        body: {
            id: 1,
            title: 'Test Product 1',
            description: 'This is a test product',
            price: 99.99,
            category: 'Phones/Digital/Computers',
            seller: 'Test Seller',
            sellerID: 123
        }
    }).as('getProductById');

    // Mock add to favorites
    cy.intercept('POST', '**/favorites*', {
        statusCode: 200,
        body: { message: 'Added to favorites' }
    }).as('addToFavorites');

    // Mock favorites listing
    cy.intercept('GET', '**/favorites*', {
        statusCode: 200,
        body: [{
            id: 1,
            title: 'Test Product 1',
            description: 'This is a test product',
            price: 99.99,
            category: 'Phones/Digital/Computers',
            seller: 'Test Seller',
            sellerID: 123
        }]
    }).as('getFavorites');

    // Mock category products
    cy.intercept('GET', '**/category*', {
        statusCode: 200,
        body: [{
            id: 2,
            title: 'Test Product 2',
            description: 'This is another test product',
            price: 149.99,
            category: 'Fashion/Bags/Sports',
            seller: 'Test Seller',
            sellerID: 123
        }]
    }).as('getCategoryProducts');

    if (skipWaiting) {
        cy.skipWaitingFor('getProducts');
        cy.skipWaitingFor('getProductById');
        cy.skipWaitingFor('addToFavorites');
        cy.skipWaitingFor('getFavorites');
        cy.skipWaitingFor('getCategoryProducts');
    }
});

// Mock auth APIs
Cypress.Commands.add('mockAuthAPIs', (skipWaiting = true) => {
    if (!Cypress.env('MOCK_API')) return;

    // Mock login API
    cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: {
            token: 'fake-jwt-token',
            user: {
                id: 1,
                username: Cypress.env('TEST_USERNAME'),
                role: 'user'
            }
        }
    }).as('loginRequest');

    // Mock change password
    cy.intercept('POST', '**/change-password', {
        statusCode: 200,
        body: { message: 'Password changed successfully' }
    }).as('changePasswordRequest');

    if (skipWaiting) {
        cy.skipWaitingFor('loginRequest');
        cy.skipWaitingFor('changePasswordRequest');
    }
}); 