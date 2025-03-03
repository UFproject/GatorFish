describe('Product Detail Page', () => {
  it('displays product details when navigating from homepage', () => {
    // Visit homepage first
    cy.visit('/');
    
    // Click on first product
    cy.get('a[href^="/item"]').first().click();
    
    // Check that product detail page has loaded
    cy.url().should('include', '/item');
    
    // Verify product elements are visible
    cy.get('img').should('be.visible'); // Product image
    cy.contains('$').should('be.visible'); // Price
    cy.contains('Contact Seller').should('be.visible'); // Contact button
  });
  
  it('displays seller information', () => {
    // Using direct navigation to item with ID 1 from db.json
    cy.visit('/item?id=1');
    
    // Verify seller info
    cy.contains('John Doe').should('be.visible');
    cy.get('img[alt="John Doe"]').should('be.visible');
  });
  
  it('shows product location and views', () => {
    cy.visit('/item?id=1');
    
    cy.contains('Gainesville').should('be.visible');
    cy.contains('245').should('be.visible'); // Views count
  });
  
  it('can navigate back to homepage', () => {
    cy.visit('/item?id=1');
    
    // Click on the site logo/name to navigate home
    cy.contains('GATOR FISH MARKET').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
}); 