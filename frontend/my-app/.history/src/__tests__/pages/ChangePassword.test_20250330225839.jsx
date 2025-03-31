import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import ChnagePassword from '../../page/ChangePassword';
import { request } from '../../utils/request';

// Mock the request utility
jest.mock('../../utils/request', () => ({
    request: {
        post: jest.fn()
    }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
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

describe('ChangePassword Page', () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Set up mocks
        localStorageMock.getItem.mockReturnValue('testuser');
        require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

        // Mock successful password change
        request.post.mockResolvedValue({ success: true });
    });

    test('renders password change form', () => {
        render(<ChnagePassword />);

        // Check that form elements are rendered
        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByText('Current Password')).toBeInTheDocument();
        expect(screen.getByText('New Password')).toBeInTheDocument();
        expect(screen.getByText('New Password (again)')).toBeInTheDocument();

        // Check that button is rendered
        const changeButton = screen.getByRole('button', { name: /change password/i });
        expect(changeButton).toBeInTheDocument();
    });

    test('validates all fields are required', async () => {
        render(<ChnagePassword />);

        // Click submit button without filling fields
        const changeButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(changeButton);

        // API should not be called
        expect(request.post).not.toHaveBeenCalled();
    });

    test('validates new passwords match', async () => {
        render(<ChnagePassword />);

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
        expect(request.post).not.toHaveBeenCalled();
    });

    test('submits form data when valid', async () => {
        render(<ChnagePassword />);

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
            expect(request.post).toHaveBeenCalledWith('/auth/change-password', {
                username: 'testuser',
                currentPassword: 'currentPassword',
                newPassword: 'newPassword'
            });
        });

        // Check that user is redirected after successful change
        expect(navigateMock).toHaveBeenCalled();
    });

    test('handles API error response', async () => {
        // Mock error response
        request.post.mockRejectedValue({
            response: {
                data: {
                    message: 'Current password is incorrect'
                }
            }
        });

        render(<ChnagePassword />);

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
        expect(navigateMock).not.toHaveBeenCalled();
    });
}); 