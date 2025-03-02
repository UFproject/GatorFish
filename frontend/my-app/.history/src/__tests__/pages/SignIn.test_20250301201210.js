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

describe('SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders sign in form with all fields', () => {
        renderWithProviders(<SignIn />);
        expect(screen.getByText(/sign in/i, { selector: 'h1' })).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    test('renders sign up link', () => {
        renderWithProviders(<SignIn />);

        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toHaveAttribute('href', '/register');
    });

    test('submits form with correct values', async () => {
        fetchLogin.mockResolvedValueOnce();

        renderWithProviders(<SignIn />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'testuser' }
        });

        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'testpassword' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

        // Check that the login action was dispatched with correct values
        await waitFor(() => {
            expect(fetchLogin).toHaveBeenCalledWith({
                Username: 'testuser',
                Password: 'testpassword'
            });
        });

        // Check if navigation happened
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', {
                state: { fromLogin: true }
            });
        });
    });

    test('shows error message on login failure', async () => {
        // Mock fetch login to throw an error
        fetchLogin.mockRejectedValueOnce({
            response: {
                data: {
                    error: 'Invalid credentials'
                }
            }
        });

        renderWithProviders(<SignIn />);

        // Fill in and submit the form
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'testuser' }
        });

        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'wrongpassword' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

        // Check that error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
}); 