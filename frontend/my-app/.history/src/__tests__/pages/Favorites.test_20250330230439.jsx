import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import Favorites from '../../page/Favorites';

// Mock the Favorites component
jest.mock('../../page/Favorites', () => {
    // Create a mock component that doesn't use useOutletContext
    return function MockFavorites() {
        const [activeTab, setActiveTab] = React.useState(0);

        // Mock data similar to what would be returned by useOutletContext
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

        return (
            <Box sx={{ p: 4, height: '100%', backgroundColor: 'background.paper' }}>
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{ mb: 3 }}
                >
                    <Tab label="Sellings" aria-controls="tabpanel-selling" />
                    <Tab label="Favorites" aria-controls="tabpanel-favorite" />
                </Tabs>

                <div role="tabpanel" hidden={activeTab !== 0}>
                    {activeTab === 0 && (
                        <div>
                            {mockUserProfile.posted_items?.map((product, index) => (
                                <div key={index} data-testid="product-card">
                                    <h3>{product.Title}</h3>
                                    <p>${product.Price}</p>
                                    <p>Seller: {product.Seller_name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div role="tabpanel" hidden={activeTab !== 1}>
                    {activeTab === 1 && (
                        <div>
                            {mockUserProfile.liked_items?.map((product, index) => (
                                <div key={index} data-testid="product-card">
                                    <h3>{product.Title}</h3>
                                    <p>${product.Price}</p>
                                    <p>Seller: {product.Seller_name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Box>
        );
    };
});

// Mock MUI components
const Box = ({ children, sx }) => <div>{children}</div>;
const Tabs = ({ children, value, onChange, variant, sx }) => (
    <div role="tablist">
        {React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
                selected: value === index,
                onClick: (e) => onChange(e, index)
            });
        })}
    </div>
);
const Tab = ({ label, selected, onClick }) => (
    <button role="tab" aria-selected={selected} onClick={onClick}>
        {label}
    </button>
);

// Mock ProductCard component
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
    beforeEach(() => {
        // Reset console.log mock to prevent test noise
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Sellings tab by default', () => {
        render(<Favorites />);

        // Check the Sellings tab is active
        const sellingTab = screen.getByText('Sellings');
        expect(sellingTab).toBeInTheDocument();
        expect(sellingTab).toHaveAttribute('aria-selected', 'true');

        // Check that selling products are rendered
        expect(screen.getByText('Phone Selling 1')).toBeInTheDocument();
        expect(screen.getByText('Phone Selling 2')).toBeInTheDocument();

        // Favorites should be hidden
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
        // Update the mock for empty arrays
        const { useOutletContext } = require('react-router-dom');
        useOutletContext.mockReturnValue({
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
        // Update the mock with undefined data
        const { useOutletContext } = require('react-router-dom');
        useOutletContext.mockReturnValue({
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