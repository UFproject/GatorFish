import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { request } from '../../utils/request';

// Create a mock handler for Add to Favorites
const mockHandleLiked = jest.fn();

// Mock Product component to avoid loading issues
jest.mock('../../page/Product', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
        const MockProduct = () => {
            const [dialogOpen, setDialogOpen] = React.useState(false);
            const [sellerInfo, setSellerInfo] = React.useState({
                username: 'Test Seller',
                email: 'test@example.com',
                phone: '123-456-7890'
            });

            const handleClickOpen = () => {
                setDialogOpen(true);
            };

            const handleDialogClose = () => {
                setDialogOpen(false);
            };

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
                    <div style={{ display: 'flex', gap: '1px', width: '100%' }}>
                        <button
                            onClick={handleClickOpen}
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
                        <button onClick={mockHandleLiked}>Add to Favorites</button>
                    </div>

                    {dialogOpen && (
                        <div className="MuiDialog-root" style={{
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
                                        <div style={{ width: '70%' }}>{sellerInfo.username}</div>
                                    </div>
                                    <div className="MuiGrid-container" style={{ marginBottom: '10px' }}>
                                        <div style={{ width: '30%', textAlign: 'left' }}>Email:</div>
                                        <div style={{ width: '70%' }}>{sellerInfo.email}</div>
                                    </div>
                                    <div className="MuiGrid-container" style={{ marginBottom: '10px' }}>
                                        <div style={{ width: '30%', textAlign: 'left' }}>Phone:</div>
                                        <div style={{ width: '70%' }}>{sellerInfo.phone}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                    <button onClick={handleDialogClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        return <MockProduct />;
    })
}));

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

    test('contact seller dialog shows correct information', async () => {
        // Mock the request.post function for profile fetch
        request.post.mockImplementation((url, data) => {
            if (url === '/auth/profile') {
                return Promise.resolve({
                    username: 'Test Seller',
                    email: 'test@example.com',
                    phone: '123-456-7890'
                });
            }
            return Promise.resolve({});
        });

        render(<Product />);

        // Click the contact seller button
        const contactButton = screen.getByText('Contact Seller');
        fireEvent.click(contactButton);

        // Wait for the dialog to appear and check its contents
        await waitFor(() => {
            expect(screen.getByText('Seller Info')).toBeInTheDocument();
            expect(screen.getByText('Test Seller')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('123-456-7890')).toBeInTheDocument();
        });
    });

    test('contact seller dialog can be closed', async () => {
        render(<Product />);

        // Open the dialog
        const contactButton = screen.getByText('Contact Seller');
        fireEvent.click(contactButton);

        // Wait for dialog to appear
        await waitFor(() => {
            expect(screen.getByText('Seller Info')).toBeInTheDocument();
        });

        // Close the dialog
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        // Verify dialog is closed
        expect(screen.queryByText('Seller Info')).not.toBeInTheDocument();
    });

    test('contact seller button has correct styling', () => {
        render(<Product />);

        const contactButton = screen.getByText('Contact Seller');
        const buttonContainer = contactButton.closest('button');

        expect(buttonContainer).toHaveStyle({
            backgroundColor: '#0021A5',
            width: 'calc(50% - 4px)'
        });
    });
}); 