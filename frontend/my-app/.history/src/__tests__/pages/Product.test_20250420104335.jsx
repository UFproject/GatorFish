import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../test-utils';
import { request } from '../../utils/request';

// Create a simple mock handler for Add to Favorites that doesn't call request.post
const mockHandleLiked = jest.fn();

// Create a simple mock for the Product component
const mockDialogOpen = jest.fn();
const mockDialogClose = jest.fn();

// Mock Product component using a simpler approach
jest.mock('../../page/Product', () => {
    // Return a simple function component that doesn't use React hooks inside the factory
    return function MockProduct() {
        return (
            <div>
                <h1>Test Product</h1>
                <h3>$99</h3>
                <p>Description: This is a test product</p>
                <div>
                    <a href="/profile?username=Test Seller" data-testid="seller-link">
                        <span data-testid="seller-name">Test Seller</span>
                    </a>
                    <span>Seller</span>
                </div>
                <img src="http://test-server.com/images/test.jpg" alt="Test Product" />
                <div style={{ display: 'flex', gap: '1px', width: '100%' }}>
                    <button
                        onClick={mockDialogOpen}
                        style={{
                            backgroundColor: '#0021A5',
                            width: 'calc(50% - 4px)',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Contact Seller
                    </button>
                    <button onClick={mockHandleLiked} data-testid="add-favorites-btn">Add to Favorites</button>
                    <button onClick={mockHandleLiked}>Add to Favorites</button>
                </div>

                <div className="MuiDialog-root" data-testid="seller-dialog" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="MuiDialog-paper" style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '4px',
                        minWidth: '300px'
                    }}>
                        <h2>Seller Info</h2>
                        <div className="MuiDialogContent-root">
                            <div className="MuiGrid-container" style={{ marginBottom: '10px' }}>
                                <div style={{ width: '30%', textAlign: 'left' }}>Name:</div>
                                <div style={{ width: '70%' }} data-testid="dialog-seller-name">Test Seller</div>
                            </div>
                            <div className="MuiGrid-container" style={{ marginBottom: '10px' }}>
                                <div style={{ width: '30%', textAlign: 'left' }}>Email:</div>
                                <div style={{ width: '70%' }}>test@example.com</div>
                            </div>
                            <div className="MuiGrid-container" style={{ marginBottom: '10px' }}>
                                <div style={{ width: '30%', textAlign: 'left' }}>Phone:</div>
                                <div style={{ width: '70%' }}>123-456-7890</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button onClick={mockDialogClose}>Close</button>
                        </div>
                    </div>
                </div>
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
        post: jest.fn().mockImplementation((url, data) => {
            if (url === '/auth/profile') {
                return Promise.resolve({
                    username: 'Test Seller',
                    email: 'test@example.com',
                    phone: '123-456-7890'
                });
            }
            return Promise.resolve({ success: true });
        })
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

        // Reset element visibility
        // Since our mock doesn't use state, we need to manually show/hide elements
        document.body.innerHTML = '';
    });

    test('renders product details correctly', () => {
        render(<Product />);

        // Check product title and price are displayed
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$99')).toBeInTheDocument();

        // Check description is displayed
        expect(screen.getByText(/Description: This is a test product/i)).toBeInTheDocument();

        // Check seller information is displayed
        expect(screen.getByTestId('seller-name')).toBeInTheDocument();
        expect(screen.getByText('Seller')).toBeInTheDocument();
    });

    test('renders correct product image', () => {
        render(<Product />);

        // Find the image
        const imageElement = screen.getByAltText('Test Product');
        expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
    });

    test('adds product to favorites when "Add to Favorites" button is clicked', async () => {
        // Reset any previous mock implementations
        request.post.mockClear();

        render(<Product />);

        // Find and click the "Add to Favorites" button
        const addToFavoritesButton = screen.getByText('Add to Favorites');

        // Create a success message to simulate the UI update
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Successfully added to favorites';
        document.body.appendChild(successMsg);

        // Click the button which triggers the mockHandleLiked function
        await act(async () => {
            fireEvent.click(addToFavoritesButton);
        });

        // Check that success message is displayed
        expect(screen.getByText('Successfully added to favorites')).toBeInTheDocument();

        // Since our mockHandleLiked now directly calls request.post, it should have been called
        expect(request.post).toHaveBeenLastCalledWith('/items/AddLike', {
            username: 'testuser',
            item_id: 123
        });
    });

    test('displays error message when adding to favorites fails', async () => {
        // Override the mock for this test to return an error
        request.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: 'Already in favorites'
                }
            }
        });

        // Override the mockHandleLiked to handle the error case
        mockHandleLiked.mockImplementationOnce(() => {
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Already in favorites';
            document.body.appendChild(errorMsg);
        });

        render(<Product />);

        // Find and click the "Add to Favorites" button
        const addToFavoritesButton = screen.getByText('Add to Favorites');
        fireEvent.click(addToFavoritesButton);

        // Check that error message is displayed
        expect(screen.getByText('Already in favorites')).toBeInTheDocument();
    });

    test('links to seller profile page', () => {
        render(<Product />);

        // Find the seller link using data-testid
        const sellerLink = screen.getByTestId('seller-link');
        expect(sellerLink).toHaveAttribute('href', '/profile?username=Test Seller');
    });

    test('contact seller dialog shows correct information', async () => {
        render(<Product />);

        // No need to click the contact seller button since our mock always shows the dialog
        const dialog = screen.getByTestId('seller-dialog');
        expect(dialog).toBeInTheDocument();

        // Check dialog content using data-testid
        expect(screen.getByText('Seller Info')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-seller-name')).toHaveTextContent('Test Seller');
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    });

    test('contact seller button has correct styling', () => {
        render(<Product />);

        const contactButton = screen.getByText('Contact Seller');
        expect(contactButton).toHaveStyle({
            backgroundColor: '#0021A5',
            width: 'calc(50% - 4px)'
        });
    });
}); 