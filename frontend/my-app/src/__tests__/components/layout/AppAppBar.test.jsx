import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/test-utils';
import AppAppBar from '../../../components/layout/AppAppBar';
import { clearUserInfo } from '../../../store/modules/user';

// Mock useDispatch
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
}));

describe('AppAppBar', () => {
    // Test rendering when user is not logged in
    test('renders sign in button when user is not logged in', () => {
        // Mock localStorage.getItem to return null (no token)
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
            },
            writable: true,
        });

        render(<AppAppBar />);

        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument(); // Avatar should not be present
    });

    // Test rendering when user is logged in
    test('renders avatar when user is logged in', () => {
        // Mock localStorage.getItem to return a token
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
            },
            writable: true,
        });

        render(<AppAppBar />);

        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument(); // Avatar should be present
    });

    // Test menu opening on avatar click
    test('opens menu when avatar is clicked', () => {
        // Mock localStorage to return a token
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
            },
            writable: true,
        });

        render(<AppAppBar />);

        fireEvent.click(screen.getByRole('img'));

        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Selling')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    // Test search bar rendering
    test('renders search bar', () => {
        render(<AppAppBar />);

        expect(screen.getByPlaceholderText('Search for anything')).toBeInTheDocument();
    });
}); 