import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import ProductUpdateCard from '../../../components/products/ProductUpdateCard';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => {
    const navigateMock = jest.fn();

    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => navigateMock,
        Link: ({ to, state, children, ...props }) => (
            <a href={to} {...props} data-state={JSON.stringify(state)}>{children}</a>
        ),
        // Make navigateMock accessible
        __esModule: true,
        navigateMock
    };
});

// Mock process.env
process.env.REACT_APP_BASE_URL = 'http://test-server.com';

describe('ProductUpdateCard', () => {
    const mockProduct = {
        Item_id: 123,
        Title: "Test Product",
        Price: 99,
        Pic: "/images/test.jpg",
        Seller_name: "Test Seller"
    };

    beforeEach(() => {
        // Clear navigate mock
        jest.clearAllMocks();
    });

    test('renders product title correctly', () => {
        render(<ProductUpdateCard product={mockProduct} />);
        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    test('renders product price correctly', () => {
        render(<ProductUpdateCard product={mockProduct} />);
        expect(screen.getByText('$99')).toBeInTheDocument();
    });

    test('renders seller name correctly', () => {
        render(<ProductUpdateCard product={mockProduct} />);
        expect(screen.getByText('Test Seller')).toBeInTheDocument();
    });

    test('includes correct link to product page', () => {
        render(<ProductUpdateCard product={mockProduct} />);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/item?id=123');

        // Check the state is passed correctly
        expect(linkElement).toHaveAttribute('data-state', JSON.stringify({ product: mockProduct }));
    });

    test('renders product image with correct URL', () => {
        render(<ProductUpdateCard product={mockProduct} />);
        const imageElement = screen.getByAltText('Test Product');
        expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
    });

    test('navigates to update page when Edit button is clicked', () => {
        const { navigateMock } = require('react-router-dom');
        render(<ProductUpdateCard product={mockProduct} />);

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(navigateMock).toHaveBeenCalledWith('/updateItem', {
            state: { product: mockProduct }
        });
    });
}); 