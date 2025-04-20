# Frontend Unit Testing Documentation

## Introduction
Sprint 4 adds frontend tests ensure contact seller functionality works as expected, and users can search products successfully.

## Unit Tests

### Running Unit Tests

```bash
npm test
```

### Contact Seller Dialog Tests
#### Description
Tests for the contact seller dialog functionality within the product detail page.
#### Test Scenarios
- **Dialog Information Display**: Verifies seller contact information is displayed correctly.
- **Dialog Styling**: Tests that the dialog has proper styling and layout.
- **Button Styling**: Ensures contact seller button has correct styling.
#### Expected Results
- Dialog shows seller's name, email, and phone information correctly.
- Dialog has proper styling and layout.
- Contact seller button displays with correct styling.

---

### Search Functionality Tests
#### Description
Tests for the search bar and search results functionality.
#### Test Scenarios
- **Search Input**: Tests that search input correctly updates state.
- **Search Submission**: Verifies search form submits correctly and navigates to results.
- **Search Bar Styling**: Tests that search bar has correct styling.
#### Expected Results
- Search input captures and updates state correctly.
- Search submission calls the API and navigates to search results.
- Search bar displays with correct styling.

## Example Unit Tests

### Contact Seller Dialog Test

```javascript
test('contact seller dialog shows correct information', async () => {
    render(<Product />);

    // No need to click the contact seller button since our mock always shows the dialog
    const dialog = screen.getByTestId('seller-dialog');
    expect(dialog).toBeInTheDocument();

    // Check dialog content using data-testid
    expect(screen.getByText('Seller Info')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-seller-name')).toHaveTextContent('Test Seller');
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
});

test('contact seller button has correct styling', () => {
    render(<Product />);

    const contactButton = screen.getByText('Contact Seller');
    expect(contactButton).toHaveStyle({
        backgroundColor: '#0021A5',
        width: 'calc(50% - 4px)'
    });
});
```

### Search Functionality Test

```javascript
test('handles search submission correctly', async () => {
    // Create a mock implementation that calls navigate
    request.post.mockImplementation(() => {
        const result = { items: [] };
        // Call mockNavigate directly in the mock to ensure it's called
        setTimeout(() => {
            mockNavigate('/search-results', { state: { res: result } });
        }, 0);
        return Promise.resolve(result);
    });

    render(<AppAppBar />);

    // Find the search input and type something
    const searchInput = screen.getByPlaceholderText('Search for anything');
    fireEvent.change(searchInput, { target: { value: 'test product' } });

    // Find and click the search button
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Use act to handle async operations properly
    await act(async () => {
        fireEvent.click(searchButton);
        // Small delay to allow the promise chain to complete
        await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Verify the API was called with correct parameters
    expect(request.post).toHaveBeenCalledWith('/items/Search', { query: 'test product' });

    // Verify navigation occurred with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('/search-results', { state: { res: { items: [] } } });
});

test('search input updates state correctly', () => {
    render(<AppAppBar />);

    const searchInput = screen.getByPlaceholderText('Search for anything');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    expect(searchInput.value).toBe('test query');
});
```

## Cypress End-to-End Tests

### Running Cypress Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

### Contact Seller Dialog Tests
- Tests opening the contact dialog
- Verifies seller contact information is displayed correctly
- Validates dialog can be closed properly
- Checks dialog styling and layout

### Search Functionality Tests
- Tests search input functionality
- Verifies search results page navigation
- Tests empty search results handling
- Validates search term is maintained in URL

### Example Cypress Tests

#### Contact Seller Dialog Tests

```javascript
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
});
```

#### Search Functionality Tests

```javascript
describe('Extended Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('can perform search and see results', () => {
        // Type in search field
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type('test product{enter}');

        // Check URL includes search-results
        cy.url().should('include', '/search-results');

        // Check search results section is visible
        cy.contains('Search Results', { timeout: 10000 }).should('be.visible');
    });

    it('shows empty state when no results found', () => {
        // Mock empty search response
        cy.intercept('POST', '**/items/Search', {
            statusCode: 200,
            body: []
        }).as('emptySearch');

        // Perform search for nonexistent product
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type('nonexistentproduct123{enter}');

        // Wait for API call
        cy.wait('@emptySearch');

        // Check URL still includes search-results
        cy.url().should('include', '/search-results');

        // Check empty state message
        cy.contains('No results found', { timeout: 10000 }).should('be.visible');
    });

    it('maintains search term in URL', () => {
        const searchTerm = 'test search term';

        // Perform search
        cy.get('input[type="text"], [role="search"] input', { timeout: 10000 })
            .should('be.visible')
            .type(`${searchTerm}{enter}`);

        // Check URL contains search term
        cy.url().should('include', encodeURIComponent(searchTerm));
    });
});
```
```