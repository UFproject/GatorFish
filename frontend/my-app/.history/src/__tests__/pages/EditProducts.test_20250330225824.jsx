import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { useNavigate } from 'react-router-dom';
import ManageItem from '../../page/ManageItem';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useOutletContext: jest.fn(),
    Link: ({ to, state, children, ...props }) => (
        <a href={to} {...props} data-state={JSON.stringify(state)}>{children}</a>
    )
}));

// Mock components
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

describe('ManageItem / Edit Products Page', () => {
    const mockUserProfile = {
        posted_items: [
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
        ]
    };

    beforeEach(() => {
        // Set up the mock for useOutletContext
        require('react-router-dom').useOutletContext.mockReturnValue({
            userProfile: mockUserProfile
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
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
        // Set up the mock for an empty userProfile
        require('react-router-dom').useOutletContext.mockReturnValue({
            userProfile: { posted_items: [] }
        });

        render(<ManageItem />);

        // Check that no product cards are rendered
        const productCards = screen.queryAllByTestId('product-update-card');
        expect(productCards).toHaveLength(0);
    });

    test('handles case where userProfile data is loading', () => {
        // Set up the mock for a undefined userProfile
        require('react-router-dom').useOutletContext.mockReturnValue({
            userProfile: { posted_items: undefined }
        });

        render(<ManageItem />);

        // Check that no product cards are rendered and no errors occur
        const productCards = screen.queryAllByTestId('product-update-card');
        expect(productCards).toHaveLength(0);
    });
}); 