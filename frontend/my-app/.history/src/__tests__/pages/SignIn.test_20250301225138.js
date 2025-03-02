import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../../page/SignIn';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/modules/user';

// Mock navigate and location
const mockNavigate = jest.fn();

// Mock react-router-dom with simplified approach
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
    Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock the fetchLogin redux action
jest.mock('../../store/modules/user', () => ({
    ...jest.requireActual('../../store/modules/user'),
    fetchLogin: jest.fn()
}));

// Get reference to the mocked fetchLogin function
const { fetchLogin } = require('../../store/modules/user');

const renderWithProviders = (ui) => {
    const store = configureStore({
        reducer: { user: userReducer }
    });

    return render(
        <Provider store={store}>
            {ui}
        </Provider>
    );
};

// Mock preventDefault to prevent form submission
const mockPreventDefault = jest.fn();

describe('SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders sign in form with all fields', () => {
        renderWithProviders(<SignIn />);
        expect(screen.getByText(/sign in/i, { selector: 'h1' })).toBeInTheDocument();

        // Use getByPlaceholderText instead of getByLabelText
        expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    test('renders sign up link', () => {
        renderWithProviders(<SignIn />);

        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toHaveAttribute('href', '/register');
    });

    test('submits form with correct values', async () => {
        // Setup successful login response
        fetchLogin.mockImplementation(() => Promise.resolve());

        renderWithProviders(<SignIn />);

        // Fill in form fields
        fireEvent.change(screen.getByPlaceholderText('username'), {
            target: { value: 'testuser' }
        });

        fireEvent.change(screen.getByPlaceholderText('••••••'), {
            target: { value: 'password123' }
        });

        // Use the submit button instead of trying to find the form by role
        const submitButton = screen.getByRole('button', { name: 'Sign in' });
        fireEvent.click(submitButton);

        // Verify fetchLogin called with correct args
        await waitFor(() => {
            expect(fetchLogin).toHaveBeenCalledWith({
                Username: 'testuser',
                Password: 'password123'
            });
        });

        // Check navigation happened
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', {
                state: { fromLogin: true }
            });
        });
    });

    test('shows error message on login failure', async () => {
        // Setup error response with proper structure
        fetchLogin.mockImplementation(() =>
            Promise.reject({
                response: {
                    data: {
                        error: 'Invalid credentials'
                    }
                }
            })
        );

        renderWithProviders(<SignIn />);

        // Fill in form fields
        fireEvent.change(screen.getByPlaceholderText('username'), {
            target: { value: 'testuser' }
        });

        fireEvent.change(screen.getByPlaceholderText('••••••'), {
            target: { value: 'wrongpassword' }
        });

        // Use the submit button instead of trying to find the form by role
        const submitButton = screen.getByRole('button', { name: 'Sign in' });
        fireEvent.click(submitButton);

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
}); 