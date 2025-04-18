describe('Change Password', () => {
    beforeEach(() => {
        // Login through UI
        cy.visit('/login');
        cy.get('input[placeholder="username"]').type('testuser');
        cy.get('input[type="password"]').type('password123');
        cy.get('button').contains('Sign in').click();

        // Wait for login to complete and redirect
        cy.url().should('not.include', '/login');

        // Visit the change password page
        cy.visit('/change-password');
    });

    it('displays the change password form', () => {
        cy.contains('Change Password').should('be.visible');
        cy.get('form').should('be.visible');
    });

    it('requires all fields to be filled', () => {
        // Click submit without filling in fields
        cy.get('button[type="submit"]').click();

        // Verify validation errors appear
        cy.contains('Current password is required').should('be.visible');
        cy.contains('New password is required').should('be.visible');
        cy.contains('Confirm password is required').should('be.visible');
    });

    it('validates password confirmation matches', () => {
        // Fill in current password
        cy.get('input[name="currentPassword"]').type('password123');

        // Fill in new password
        cy.get('input[name="newPassword"]').type('newPassword123');

        // Fill in confirm password with different value
        cy.get('input[name="confirmPassword"]').type('differentPassword123');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Verify error message
        cy.contains('Passwords do not match').should('be.visible');
    });

    it('shows error for incorrect current password', () => {
        // Mock the API endpoint - stubbing the response to simulate an error
        cy.intercept('POST', '**/change-password', {
            statusCode: 401,
            body: {
                message: 'Current password is incorrect'
            }
        }).as('changePasswordAttempt');

        // Fill in current password with incorrect value
        cy.get('input[name="currentPassword"]').type('wrongPassword');

        // Fill in new password
        cy.get('input[name="newPassword"]').type('newPassword123');

        // Fill in confirm password
        cy.get('input[name="confirmPassword"]').type('newPassword123');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Wait for the request to complete
        cy.wait('@changePasswordAttempt');

        // Verify error message
        cy.contains('Current password is incorrect').should('be.visible');
    });

    it('successfully changes password', () => {
        // Mock the API endpoint - stubbing the response to simulate success
        cy.intercept('POST', '**/change-password', {
            statusCode: 200,
            body: {
                message: 'Password changed successfully'
            }
        }).as('changePasswordSuccess');

        // Fill in correct current password
        cy.get('input[name="currentPassword"]').type('password123');

        // Fill in new password
        cy.get('input[name="newPassword"]').type('newPassword123');

        // Fill in confirm password
        cy.get('input[name="confirmPassword"]').type('newPassword123');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Wait for the request to complete
        cy.wait('@changePasswordSuccess');

        // Verify success message
        cy.contains('Password changed successfully').should('be.visible');
    });

    it('checks for password strength requirements', () => {
        // Fill in current password
        cy.get('input[name="currentPassword"]').type('password123');

        // Fill in new password that is too short
        cy.get('input[name="newPassword"]').type('short');

        // Fill in confirm password
        cy.get('input[name="confirmPassword"]').type('short');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Verify error message
        cy.contains('Password must be at least 8 characters').should('be.visible');
    });

    it('shows loading state while submitting', () => {
        // Mock the API endpoint with a delay
        cy.intercept('POST', '**/change-password', (req) => {
            req.reply({
                delay: 1000,
                statusCode: 200,
                body: {
                    message: 'Password changed successfully'
                }
            });
        }).as('changePasswordWithDelay');

        // Fill in correct current password
        cy.get('input[name="currentPassword"]').type('password123');

        // Fill in new password
        cy.get('input[name="newPassword"]').type('newPassword123');

        // Fill in confirm password
        cy.get('input[name="confirmPassword"]').type('newPassword123');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Check for loading indicator (using multiple possible selectors)
        cy.get('[role="progressbar"], .loading-spinner, [data-testid="loading-indicator"]').should('exist');

        // Wait for the request to complete
        cy.wait('@changePasswordWithDelay');

        // Verify success message and loading indicator is gone
        cy.get('[role="progressbar"], .loading-spinner, [data-testid="loading-indicator"]').should('not.exist');
        cy.contains('Password changed successfully').should('be.visible');
    });
}); 