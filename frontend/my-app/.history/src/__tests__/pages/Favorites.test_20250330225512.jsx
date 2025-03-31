import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import Favorites from '../../page/Favorites';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn()
}));

// Mock components
jest.mock('../../components/products/ProductCard', () => {
  return function MockProductCard({ product }) {
    return (
      <div data-testid="product-card">
        <h3>{product.Title}</h3>
        <p>${product.Price}</p>
        <p>Seller: {product.Seller_name}</p>
      </div>
    );
  };
});

describe('Favorites Page', () => {
  const mockUserProfile = {
    posted_items: [
      {
        Item_id: 1,
        Title: "Phone Selling 1",
        Price: 100,
        Pic: "/images/phone1.jpg",
        Seller_name: "test"
      },
      {
        Item_id: 2,
        Title: "Phone Selling 2",
        Price: 100,
        Pic: "/images/phone2.jpg",
        Seller_name: "test"
      }
    ],
    liked_items: [
      {
        Item_id: 3,
        Title: "Favorite Item 1",
        Price: 20,
        Pic: "/images/favorite1.jpg",
        Seller_name: "otherUser"
      },
      {
        Item_id: 4,
        Title: "Favorite Item 2",
        Price: 30,
        Pic: "/images/favorite2.jpg",
        Seller_name: "anotherUser"
      }
    ]
  };

  beforeEach(() => {
    // Set up the mock for useOutletContext
    require('react-router-dom').useOutletContext.mockReturnValue({
      userProfile: mockUserProfile
    });
    
    // Reset console.log mock to prevent test noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Sellings tab by default', () => {
    render(<Favorites />);
    
    // Check the Sellings tab is active
    const sellingTab = screen.getByText('Sellings');
    expect(sellingTab).toBeInTheDocument();
    
    // Check that selling products are rendered
    expect(screen.getByText('Phone Selling 1')).toBeInTheDocument();
    expect(screen.getByText('Phone Selling 2')).toBeInTheDocument();
    
    // Favorites should be hidden initially
    expect(screen.queryByText('Favorite Item 1')).not.toBeInTheDocument();
  });

  test('switches to Favorites tab when clicked', () => {
    render(<Favorites />);
    
    // Click on the Favorites tab
    const favoritesTab = screen.getByText('Favorites');
    fireEvent.click(favoritesTab);
    
    // Check that favorite products are rendered
    expect(screen.getByText('Favorite Item 1')).toBeInTheDocument();
    expect(screen.getByText('Favorite Item 2')).toBeInTheDocument();
    
    // Selling items should be hidden
    expect(screen.queryByText('Phone Selling 1')).not.toBeInTheDocument();
  });

  test('displays the correct number of products in each tab', () => {
    render(<Favorites />);
    
    // Check Sellings tab
    let productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
    
    // Switch to Favorites tab
    const favoritesTab = screen.getByText('Favorites');
    fireEvent.click(favoritesTab);
    
    // Check Favorites tab
    productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
  });

  test('handles case where user has no items in a tab', () => {
    // Set up the mock with empty arrays
    require('react-router-dom').useOutletContext.mockReturnValue({
      userProfile: {
        posted_items: [],
        liked_items: []
      }
    });

    render(<Favorites />);
    
    // Check that no product cards are rendered in Sellings tab
    let productCards = screen.queryAllByTestId('product-card');
    expect(productCards).toHaveLength(0);
    
    // Switch to Favorites tab
    const favoritesTab = screen.getByText('Favorites');
    fireEvent.click(favoritesTab);
    
    // Check that no product cards are rendered in Favorites tab
    productCards = screen.queryAllByTestId('product-card');
    expect(productCards).toHaveLength(0);
  });

  test('handles case where userProfile data is loading', () => {
    // Set up the mock with undefined data
    require('react-router-dom').useOutletContext.mockReturnValue({
      userProfile: {
        posted_items: undefined,
        liked_items: undefined
      }
    });

    render(<Favorites />);
    
    // Check that no errors occur and no products are rendered
    const productCards = screen.queryAllByTestId('product-card');
    expect(productCards).toHaveLength(0);
  });
}); 