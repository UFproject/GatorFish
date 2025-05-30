import React from 'react';
import { render, screen, waitFor, act } from '../../__tests__/test-utils';
import Homepage from '../../page/Homepage';
import { request } from '../../utils/request';

// Mock the request module
jest.mock('../../utils/request', () => ({
    request: {
        post: jest.fn()
    }
}));

// See test-utils.js for how react-router-dom is being mocked
// We'll reuse that mock and modify it for each test as needed

describe('Homepage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset the react-router-dom mock
        jest.resetModules();

        // Set up mock responses for all three API calls
        request.post.mockImplementation((url, data) => {
            if (url === '/items/Category' && data.category_name === 'Phones/Digital/Computers') {
                return Promise.resolve({
                    items: [
                        { Item_id: 1, Title: 'Electronics Item 1', Price: 100, Pic: '/test1.jpg', Seller_name: 'Seller 1' }
                    ]
                });
            } else if (url === '/items/Category' && data.category_name === 'Fashion/Bags/Sports') {
                return Promise.resolve({
                    items: [
                        { Item_id: 2, Title: 'Digital Item 1', Price: 200, Pic: '/test2.jpg', Seller_name: 'Seller 2' }
                    ]
                });
            } else if (url === '/items/Category' && data.category_name === 'Baby/Beauty/Personal Care') {
                return Promise.resolve({
                    items: [
                        { Item_id: 3, Title: 'Baby Item 1', Price: 300, Pic: '/test3.jpg', Seller_name: 'Seller 3' }
                    ]
                });
            }
            return Promise.resolve({ items: [] });
        });
    });

    test('renders AppAppBar component', async () => {
        await act(async () => {
            render(<Homepage />);
        });
        expect(screen.getByText('GATOR FISH MARKET')).toBeInTheDocument();
    });

    test('renders CategoryMenu component', async () => {
        await act(async () => {
            render(<Homepage />);
        });
        // Check for the first item in the CategoryMenu
        const categoryItems = screen.getAllByText('Phones/Digital/Computers');
        expect(categoryItems.length).toBeGreaterThan(0);
    });

    test('renders featured section titles correctly', async () => {
        await act(async () => {
            render(<Homepage />);
        });

        // Use more specific selectors for section headings
        const sectionHeadings = screen.getAllByRole('heading', { level: 2 });

        // Check that each expected section title exists in the headings
        const sectionTitles = sectionHeadings.map(heading => heading.textContent);
        expect(sectionTitles).toContain('Phones/Digital/Computers');
        expect(sectionTitles).toContain('Fashion/Bags/Sports');
        expect(sectionTitles).toContain('Baby/Beauty/Personal Care');
    });

    test('fetches and displays items from API', async () => {
        await act(async () => {
            render(<Homepage />);
        });

        // Wait for API calls to resolve and verify correct number of calls
        await waitFor(() => {
            expect(request.post).toHaveBeenCalledTimes(3);
        });

        // Verify each API call was made with correct parameters
        expect(request.post).toHaveBeenCalledWith('/items/Category', {
            "category_name": "Phones/Digital/Computers",
            "start": 0,
            "end": 10
        });

        expect(request.post).toHaveBeenCalledWith('/items/Category', {
            "category_name": "Fashion/Bags/Sports",
            "start": 0,
            "end": 4
        });

        expect(request.post).toHaveBeenCalledWith('/items/Category', {
            "category_name": "Baby/Beauty/Personal Care",
            "start": 0,
            "end": 4
        });

        // Wait for items to be rendered (they might take a moment after the API calls)
        await waitFor(() => {
            expect(screen.getByText('Electronics Item 1')).toBeInTheDocument();
            expect(screen.getByText('Digital Item 1')).toBeInTheDocument();
            expect(screen.getByText('Baby Item 1')).toBeInTheDocument();
        });
    });

    test('shows login success notification when coming from login page', async () => {
        // Mock react-router-dom directly with the login state
        jest.doMock('react-router-dom', () => ({
            BrowserRouter: ({ children }) => <div>{children}</div>,
            Link: ({ to, children }) => <a href={to}>{children}</a>,
            useNavigate: () => jest.fn(),
            useLocation: () => ({ state: { fromLogin: true }, pathname: '/' })
        }), { virtual: true });

        // Need to require Homepage again to use the updated mock
        const HomepageWithMock = require('../../page/Homepage').default;

        // Render the component with login simulation
        render(<HomepageWithMock />);

        // Verify the snackbar appears
        expect(screen.getByText('Login Successful!')).toBeInTheDocument();
    });
}); 