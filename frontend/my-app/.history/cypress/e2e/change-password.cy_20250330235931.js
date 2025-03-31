describe('Change Password', () => {
    beforeEach(() => {
        // Login first
        cy.request({
            method: 'POST',
            url: '/auth/login',
            body: {
                Username: 'testuser',
                Password: 'password123'
            }
        }).then((resp) => {
            // Save token to localStorage
            window.localStorage.setItem('token_key', resp.body.token);
        });

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
        // Intercept the change password request to mock an incorrect password error
        cy.intercept('POST', '/auth/change-password', {
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
        // Intercept the change password request to mock a success response
        cy.intercept('POST', '/auth/change-password', {
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
        // Intercept the change password request and delay the response
        cy.intercept('POST', '/auth/change-password', (req) => {
            req.on('response', (res) => {
                res.setDelay(1000);
                res.send({
                    statusCode: 200,
                    body: {
                        message: 'Password changed successfully'
                    }
                });
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

        // Check for loading indicator
        cy.get('[data-testid="loading-indicator"]').should('be.visible');

        // Wait for the request to complete
        cy.wait('@changePasswordWithDelay');

        // Verify success message and loading indicator is gone
        cy.get('[data-testid="loading-indicator"]').should('not.exist');
        cy.contains('Password changed successfully').should('be.visible');
    });
}); 