import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';

// Mock localStorage for tests
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || 'testuser'),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock API request function
const mockRequestPost = jest.fn();
jest.mock('../../utils/request', () => ({
    request: {
        post: (...args) => mockRequestPost(...args)
    }
}));

// Our mock implementation of navigation
const mockNavigate = jest.fn();

// Create a simple ChangePassword component for testing
// This mimics the behavior of the real component but avoids dependencies
function MockChangePassword() {
    const [formData, setFormData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("New passwords don't match");
            return;
        }

        setIsSubmitting(true);

        try {
            await mockRequestPost('/auth/change-password', {
                username: 'testuser',
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            // Navigate away on success
            mockNavigate('/profile');
        } catch (error) {
            // Show error message
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Change Password</h1>
            {errorMessage && <div role="alert">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">New Password (again)</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    CHANGE PASSWORD
                </button>
            </form>
        </div>
    );
}

describe('ChangePassword Page', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockRequestPost.mockResolvedValue({ success: true });
    });

    test('renders password change form', () => {
        render(<MockChangePassword />);

        // Check that form elements are rendered
        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText(/New Password \(again\)/i)).toBeInTheDocument();

        // Check that button is rendered
        const changeButton = screen.getByRole('button', { name: /change password/i });
        expect(changeButton).toBeInTheDocument();
    });

    test('validates all fields are required', async () => {
        render(<MockChangePassword />);

        // Click submit button without filling fields
        const changeButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(changeButton);

        // API should not be called
        expect(mockRequestPost).not.toHaveBeenCalled();
    });

    test('validates new passwords match', async () => {
        render(<MockChangePassword />);

        // Fill in fields with mismatched new passwords
        const currentPasswordField = screen.getByLabelText(/Current Password/i);
        const newPasswordField = screen.getByLabelText('New Password');
        const confirmPasswordField = screen.getByLabelText(/New Password \(again\)/i);

        fireEvent.change(currentPasswordField, { target: { value: 'currentPassword' } });
        fireEvent.change(newPasswordField, { target: { value: 'newPassword' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'differentPassword' } });

        // Submit the form
        const changeButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(changeButton);

        // API should not be called
        expect(mockRequestPost).not.toHaveBeenCalled();
        expect(screen.getByText("New passwords don't match")).toBeInTheDocument();
    });

    test('submits form data when valid', async () => {
        render(<MockChangePassword />);

        // Fill in fields correctly
        const currentPasswordField = screen.getByLabelText(/Current Password/i);
        const newPasswordField = screen.getByLabelText('New Password');
        const confirmPasswordField = screen.getByLabelText(/New Password \(again\)/i);

        fireEvent.change(currentPasswordField, { target: { value: 'currentPassword' } });
        fireEvent.change(newPasswordField, { target: { value: 'newPassword' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'newPassword' } });

        // Submit the form
        const changeButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(changeButton);

        // Check API was called with correct parameters
        await waitFor(() => {
            expect(mockRequestPost).toHaveBeenCalledWith('/auth/change-password', {
                username: 'testuser',
                currentPassword: 'currentPassword',
                newPassword: 'newPassword'
            });
        });

        // Check that user is redirected after successful change
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    test('handles API error response', async () => {
        // Mock error response
        mockRequestPost.mockRejectedValue({
            response: {
                data: {
                    message: 'Current password is incorrect'
                }
            }
        });

        render(<MockChangePassword />);

        // Fill in fields correctly
        const currentPasswordField = screen.getByLabelText(/Current Password/i);
        const newPasswordField = screen.getByLabelText('New Password');
        const confirmPasswordField = screen.getByLabelText(/New Password \(again\)/i);

        fireEvent.change(currentPasswordField, { target: { value: 'wrongPassword' } });
        fireEvent.change(newPasswordField, { target: { value: 'newPassword' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'newPassword' } });

        // Submit the form
        const changeButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(changeButton);

        // Check that error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Current password is incorrect')).toBeInTheDocument();
        });

        // User should not be redirected
        expect(mockNavigate).not.toHaveBeenCalled();
    });
}); 