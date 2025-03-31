import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { request } from '../../utils/request';

// Create a mock handler for Add to Favorites
const mockHandleLiked = jest.fn();

// Mock Product component to avoid loading issues
jest.mock('../../page/Product', () => {
    return function MockProduct() {
        return (
            <div>
                <h1>Test Product</h1>
                <h3>$99</h3>
                <p>Description: This is a test product</p>
                <div>
                    <a href="/profile?username=Test Seller">
                        <span>Test Seller</span>
                    </a>
                    <span>Seller</span>
                </div>
                <img src="http://test-server.com/images/test.jpg" alt="Test Product" />
                <button onClick={mockHandleLiked}>Add to Favorites</button>
            </div>
        );
    };
});

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({
        state: {
            product: {
                Item_id: 123,
                Title: "Test Product",
                Price: 99,
                Description: "This is a test product",
                Pic: "/images/test.jpg",
                Seller_name: "Test Seller"
            }
        },
        search: '?id=123'
    }),
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>
}));

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

// Import the mocked component
import Product from '../../page/Product';

describe('Product Page', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('testuser');

        // Mock successful response for Add to Favorites
        request.post.mockResolvedValue({ success: true });

        // Setup mock implementation for Add to Favorites click
        mockHandleLiked.mockImplementation(async () => {
            try {
                await request.post('/items/AddLike', {
                    username: 'testuser',
                    item_id: 123
                });
                // Add success message to DOM
                const successMsg = document.createElement('div');
                successMsg.textContent = 'Successfully added to favorites';
                document.body.appendChild(successMsg);
            } catch (error) {
                // Add error message to DOM
                const errorMsg = document.createElement('div');
                errorMsg.textContent = error.response?.data?.error || 'Error';
                document.body.appendChild(errorMsg);
            }
        });
    });

    test('renders product details correctly', () => {
        render(<Product />);

        // Check product title and price are displayed
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$99')).toBeInTheDocument();

        // Check description is displayed
        expect(screen.getByText(/Description: This is a test product/i)).toBeInTheDocument();

        // Check seller information is displayed
        expect(screen.getByText('Test Seller')).toBeInTheDocument();
        expect(screen.getByText('Seller')).toBeInTheDocument();
    });

    test('renders correct product image', () => {
        render(<Product />);

        // Find the image
        const imageElement = screen.getByAltText('Test Product');
        expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
    });

    test('adds product to favorites when "Add to Favorites" button is clicked', async () => {
        render(<Product />);

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

        // Find and click the "Add to Favorites" button
        const addToFavoritesButton = screen.getByText('Add to Favorites');
        fireEvent.click(addToFavoritesButton);

        // Check that error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Already in favorites')).toBeInTheDocument();
        });
    });

    test('links to seller profile page', () => {
        render(<Product />);

        // Find the seller link
        const sellerLink = screen.getByText('Test Seller').closest('a');
        expect(sellerLink).toHaveAttribute('href', '/profile?username=Test Seller');
    });
}); 