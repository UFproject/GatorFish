import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from '../../page/Product';

// Mock all the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({
    state: {
      product: {
        id: 1,
        Title: 'Test Product',
        Price: 99.99,
        Pic: '/images/test.jpg',
        Seller_name: 'Test Seller'
      }
    },
    search: '?id=1'
  })),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Set environment variable
process.env.REACT_APP_BASE_URL = 'http://test-server.com';

describe('Product', () => {
  test('renders product title', () => {
    render(<Product />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders product price', () => {
    render(<Product />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('renders seller information', () => {
    render(<Product />);
    expect(screen.getByText('Test Seller')).toBeInTheDocument();
  });

  test('renders contact seller button', () => {
    render(<Product />);
    expect(screen.getByText('Contact Seller')).toBeInTheDocument();
  });

  test('renders product image with correct URL', () => {
    render(<Product />);
    const image = screen.getByRole('img', { name: 'Test Product' });
    expect(image).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
  });

  test('displays loading state when product is not available', () => {
    // Override the mock to return null for product
    jest.mock('react-router-dom', () => ({
      useLocation: () => ({
        state: { product: null },
        search: '?id=1'
      })
    }));

    render(<Product />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 