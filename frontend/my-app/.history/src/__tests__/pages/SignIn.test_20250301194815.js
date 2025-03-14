import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../__tests__/test-utils';
import SignIn from '../../page/SignIn';
import { fetchLogin } from '../../store/modules/user';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: null
    })
}));

// Mock the fetchLogin redux action
jest.mock('../../store/modules/user', () => ({
    fetchLogin: jest.fn()
}));

describe('SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders sign in form with all fields', () => {
        render(<SignIn />);

        expect(screen.getByText('Sign in')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    test('renders sign up link', () => {
        render(<SignIn />);

        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toHaveAttribute('href', '/register');
    });

    test('submits form with correct values', async () => {
        fetchLogin.mockResolvedValueOnce();

        render(<SignIn />);

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

        render(<SignIn />);

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