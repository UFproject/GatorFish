import React from 'react';
import { render, screen } from '../../../__tests__/test-utils';
import ProductCard from '../../../components/products/ProductCard';

// Mock process.env
process.env.REACT_APP_BASE_URL = 'http://test-server.com';

// Mock product data
const mockProduct = {
    id: 1,
    Title: "Test Product",
    Price: 99,
    Pic: "/images/test.jpg",
    Seller_name: "Test Seller"
};

describe('ProductCard', () => {
    test('renders product title correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    test('renders product price correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('$99')).toBeInTheDocument();
    });

    test('renders seller name correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Seller')).toBeInTheDocument();
    });

    test('includes correct link to product page', () => {
        render(<ProductCard product={mockProduct} />);

        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/item?id=1');
    });

    test('renders product image with correct URL', () => {
        render(<ProductCard product={mockProduct} />);

        const imageElement = screen.getByAltText('Test Product');
        expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
        expect(imageElement).toHaveAttribute('alt', 'Test Product');
    });
}); 