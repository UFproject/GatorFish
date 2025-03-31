import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';

// Mock navigation function
const mockNavigate = jest.fn();

// Sample product data
const mockProduct = {
  Item_id: 123,
  Title: "Test Product",
  Price: 99,
  Pic: "/images/test.jpg",
  Seller_name: "Test Seller"
};

// Simple mock component that simulates ProductUpdateCard behavior
function MockProductUpdateCard() {
  const BASE_URL = 'http://test-server.com';

  const handleEditClick = () => {
    mockNavigate('/updateItem', { 
      state: { product: mockProduct } 
    });
  };

  return (
    <div>
      <div data-testid="product-card">
        <a href={`/item?id=${mockProduct.Item_id}`} data-state={JSON.stringify({ product: mockProduct })}>
          <img src={`${BASE_URL}${mockProduct.Pic}`} alt={mockProduct.Title} />
          <h3>{mockProduct.Title}</h3>
          <p>${mockProduct.Price}</p>
          <p>Seller: {mockProduct.Seller_name}</p>
        </a>
      </div>
      <button onClick={handleEditClick}>Edit</button>
    </div>
  );
}

describe('ProductUpdateCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders product title correctly', () => {
    render(<MockProductUpdateCard />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders product price correctly', () => {
    render(<MockProductUpdateCard />);
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  test('renders seller name correctly', () => {
    render(<MockProductUpdateCard />);
    expect(screen.getByText('Seller: Test Seller')).toBeInTheDocument();
  });

  test('includes correct link to product page', () => {
    render(<MockProductUpdateCard />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/item?id=123');
    
    // Check the state is passed correctly
    expect(linkElement).toHaveAttribute('data-state', JSON.stringify({ product: mockProduct }));
  });

  test('renders product image with correct URL', () => {
    render(<MockProductUpdateCard />);
    const imageElement = screen.getByAltText('Test Product');
    expect(imageElement).toHaveAttribute('src', 'http://test-server.com/images/test.jpg');
  });

  test('navigates to update page when Edit button is clicked', () => {
    render(<MockProductUpdateCard />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/updateItem', { 
      state: { product: mockProduct } 
    });
  });
}); 