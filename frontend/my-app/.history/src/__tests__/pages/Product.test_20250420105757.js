import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from '../../page/Product';
import { useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/modules/user';

// Create a test store
const store = configureStore({
    reducer: { user: userReducer },
});

// Mock all the react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock AppAppBar component to avoid useNavigate issues
jest.mock('../../components/layout/AppAppBar', () => {
    return function MockAppAppBar() {
        return <div data-testid="mock-app-bar">App Bar</div>;
    };
});

// Mock request utility
jest.mock('../../utils/request', () => ({
    request: {
        post: jest.fn().mockResolvedValue({})
    }
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => 'testuser'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
    writable: true
});

// Set environment variable
process.env.REACT_APP_BASE_URL = 'http://test-server.com';

// Create a wrapper with Redux Provider
const renderWithRedux = (ui) => {
    return render(
        <Provider store={store}>
            {ui}
        </Provider>
    );
};

describe('Product', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Reset the mock and set default implementation for most tests
        const mockUseLocation = require('react-router-dom').useLocation;
        mockUseLocation.mockImplementation(() => ({
            state: {
                product: {
                    Item_id: 1,
                    Title: 'Test Product',
                    Price: 99.99,
                    Description: 'Test description',
                    Pic: '/images/test.jpg',
                    Seller_name: 'Test Seller'
                }
            },
            search: '?id=1'
        }));
    });

    test('renders product title', () => {
        renderWithRedux(<Product />);
        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    test('renders product price', () => {
        renderWithRedux(<Product />);
        expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    test('renders seller information', () => {
        renderWithRedux(<Product />);
        expect(screen.getByText('Test Seller')).toBeInTheDocument();
    });

    test('renders contact seller button', () => {
        renderWithRedux(<Product />);
        expect(screen.getByText('Contact Seller')).toBeInTheDocument();
    });

    test('renders product image with correct URL', () => {
        renderWithRedux(<Product />);
        const image = screen.getByRole('img', { name: 'Test Product' });
        expect(image).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
    });

    test('displays loading state when product is not available', () => {
        // Override the mock for this specific test
        const mockUseLocation = require('react-router-dom').useLocation;
        mockUseLocation.mockImplementation(() => ({
            state: null,
            search: '?id=1'
        }));

        renderWithRedux(<Product />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
}); 