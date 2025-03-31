import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '../test-utils';
import Product from '../../page/Product';
import { request } from '../../utils/request';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => {
    const product = {
        Item_id: 123,
        Title: "Test Product",
        Price: 99,
        Description: "This is a test product",
        Pic: "/images/test.jpg",
        Seller_name: "Test Seller"
    };

    return {
        ...jest.requireActual('react-router-dom'),
        useLocation: jest.fn().mockReturnValue({
            state: { product },
            search: '?id=123'
        }),
        Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>
    };
});

// Mock the request utility
jest.mock('../../utils/request', () => ({
    request: {
        post: jest.fn()
    }
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

// Mock process.env
process.env.REACT_APP_BASE_URL = 'http://test-server.com';

describe('Product Page', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('testuser');

        // Mock successful response for Add to Favorites
        request.post.mockResolvedValue({ success: true });
    });

    test('renders product details correctly', async () => {
        render(<Product />);

        // Wait for loading indicator to disappear
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        // Check product title and price are displayed
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$99')).toBeInTheDocument();

        // Check description is displayed
        expect(screen.getByText(/Description: This is a test product/i)).toBeInTheDocument();

        // Check seller information is displayed
        expect(screen.getByText('Test Seller')).toBeInTheDocument();
        expect(screen.getByText('Seller')).toBeInTheDocument();
    });

    test('renders correct product image', async () => {
        render(<Product />);

        // Wait for loading indicator to disappear
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        // Find the image
        const imageElement = screen.getByAltText('Test Product');
        expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
    });

    test('adds product to favorites when "Add to Favorites" button is clicked', async () => {
        render(<Product />);

        // Wait for loading indicator to disappear
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        // Find and click the "Add to Favorites" button
        const addToFavoritesButton = screen.getByText('Add to Favorites');
        fireEvent.click(addToFavoritesButton);

        // Check that the API was called with correct parameters
        expect(request.post).toHaveBeenCalledWith('/items/AddLike', {
            username: 'testuser',
            item_id: 123
        });

        // Check that success message is displayed
        await waitFor(() => {
            expect(screen.getByText('Successfully added to favorites')).toBeInTheDocument();
        });
    });

    test('displays error message when adding to favorites fails', async () => {
        // Mock error response
        request.post.mockRejectedValue({
            response: {
                data: {
                    error: 'Already in favorites'
                }
            }
        });

        render(<Product />);

        // Wait for loading indicator to disappear
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        // Find and click the "Add to Favorites" button
        const addToFavoritesButton = screen.getByText('Add to Favorites');
        fireEvent.click(addToFavoritesButton);

        // Check that error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Already in favorites')).toBeInTheDocument();
        });
    });

    test('links to seller profile page', async () => {
        render(<Product />);

        // Wait for loading indicator to disappear
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        // Find the seller link
        const sellerLink = screen.getByText('Test Seller').closest('a');
        expect(sellerLink).toHaveAttribute('href', '/profile?username=Test Seller');
    });
}); 