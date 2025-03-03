describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });
  
  it('displays sign up form with all required fields', () => {
    cy.contains('h1', 'Sign up').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.contains('button', 'Sign up').should('be.visible');
  });
  
  it('shows validation errors for invalid inputs', () => {
    // Submit empty form
    cy.contains('button', 'Sign up').click();
    cy.contains('Username is required').should('be.visible');
    
    // Test email validation
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.contains('button', 'Sign up').click();
    cy.contains('invalid email').should('be.visible');
    
    // Test password matching
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('input[name="confirmPassword"]').clear().type('different');
    cy.contains('button', 'Sign up').click();
    cy.contains('passwords do not match').should('be.visible');
  });
  
  it('navigates to sign in page when clicking sign in link', () => {
    cy.contains('Already have an account?').should('be.visible');
    cy.contains('Sign in').click();
    cy.url().should('include', '/signin');
  });
  
  // Note: We won't test actual registration as it would create real users in your system
  // This would be a good place for an API intercept test
}); 