import React from 'react';
import { render, screen } from '../../../__tests__/test-utils';
import FeaturedSection from '../../../components/layout/FeaturedSection';

// Mock product data
const mockProducts = [
    {
        id: 1,
        Title: "Test Product 1",
        Price: 99,
        Pic: "/images/test1.jpg",
        Seller_name: "Test Seller 1"
    },
    {
        id: 2,
        Title: "Test Product 2",
        Price: 199,
        Pic: "/images/test2.jpg",
        Seller_name: "Test Seller 2"
    }
];

describe('FeaturedSection', () => {
    test('renders section title correctly', () => {
        render(<FeaturedSection title="Test Section" products={mockProducts} />);

        expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    test('renders "See All" button', () => {
        render(<FeaturedSection title="Test Section" products={mockProducts} />);

        expect(screen.getByText('See All')).toBeInTheDocument();
    });

    test('renders correct number of ProductCard components', () => {
        render(<FeaturedSection title="Test Section" products={mockProducts} />);

        // Since ProductCard renders the titles, we can check for those
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    test('limits display to 4 products', () => {
        const manyProducts = Array(6).fill(null).map((_, index) => ({
            id: index + 1,
            Title: `Test Product ${index + 1}`,
            Price: 99,
            Pic: `/images/test${index + 1}.jpg`,
            Seller_name: `Test Seller ${index + 1}`
        }));

        render(<FeaturedSection title="Test Section" products={manyProducts} />);

        // Should only show the first 4 products
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 4')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 5')).not.toBeInTheDocument();
    });
}); 