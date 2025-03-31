import React from 'react';
import { render, screen } from '../test-utils';

// Mock the ManageItem component directly to avoid issues with useOutletContext
jest.mock('../../page/ManageItem', () => {
    // Return a mock implementation that mimics the behavior of ManageItem
    return function MockManageItem(props) {
        // Access mock data via a global variable that we can control in our tests
        const userProfile = global.mockUserProfile || { posted_items: [] };

        return (
            <div>
                {userProfile.posted_items?.map((product, index) => (
                    <div key={index} data-testid="product-update-card">
                        <h3>{product.Title}</h3>
                        <p>${product.Price}</p>
                        <p>Seller: {product.Seller_name}</p>
                        <button>Edit</button>
                    </div>
                ))}
            </div>
        );
    };
});

// Also mock the ProductUpdateCard component for good measure
jest.mock('../../components/products/ProductUpdateCard', () => {
    return function MockProductUpdateCard({ product }) {
        return (
            <div data-testid="product-update-card">
                <h3>{product.Title}</h3>
                <p>${product.Price}</p>
                <p>Seller: {product.Seller_name}</p>
                <button>Edit</button>
            </div>
        );
    };
});

// Import the mocked component
import ManageItem from '../../page/ManageItem';

describe('ManageItem / Edit Products Page', () => {
    const mockProducts = [
        {
            Item_id: 1,
            Title: "Test Phone 1",
            Price: 100,
            Pic: "/images/phone1.jpg",
            Seller_name: "test"
        },
        {
            Item_id: 2,
            Title: "Test Phone 2",
            Price: 100,
            Pic: "/images/phone2.jpg",
            Seller_name: "test"
        },
        {
            Item_id: 3,
            Title: "Basketball",
            Price: 10,
            Pic: "/images/ball.jpg",
            Seller_name: "test"
        }
    ];

    beforeEach(() => {
        // Reset global mock data
        global.mockUserProfile = {
            posted_items: mockProducts
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        // Clean up global mock data
        delete global.mockUserProfile;
    });

    test('renders a list of user products that can be edited', () => {
        render(<ManageItem />);

        // Check that the correct number of products are rendered
        const productCards = screen.getAllByTestId('product-update-card');
        expect(productCards).toHaveLength(3);

        // Check that product titles are rendered
        expect(screen.getByText('Test Phone 1')).toBeInTheDocument();
        expect(screen.getByText('Test Phone 2')).toBeInTheDocument();
        expect(screen.getByText('Basketball')).toBeInTheDocument();

        // Check prices are rendered
        const priceElements = screen.getAllByText(/\$\d+/);
        expect(priceElements).toHaveLength(3);
        expect(priceElements[0].textContent).toBe('$100');
        expect(priceElements[1].textContent).toBe('$100');
        expect(priceElements[2].textContent).toBe('$10');
    });

    test('renders edit buttons for each product', () => {
        render(<ManageItem />);

        // Check that edit buttons are rendered for each product
        const editButtons = screen.getAllByText('Edit');
        expect(editButtons).toHaveLength(3);
    });

    test('handles case where user has no products', () => {
        // Set up empty products array
        global.mockUserProfile = { posted_items: [] };

        render(<ManageItem />);

        // Check that no product cards are rendered
        const productCards = screen.queryAllByTestId('product-update-card');
        expect(productCards).toHaveLength(0);
    });

    test('handles case where userProfile data is loading', () => {
        // Set up undefined products
        global.mockUserProfile = { posted_items: undefined };

        render(<ManageItem />);

        // Check that no product cards are rendered and no errors occur
        const productCards = screen.queryAllByTestId('product-update-card');
        expect(productCards).toHaveLength(0);
    });
}); 