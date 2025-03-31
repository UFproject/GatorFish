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

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({ state: null, pathname: '/' }),
    useNavigate: jest.fn()
}));

describe('Homepage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

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
        // Using a more specific selector by adding assertive role
        expect(screen.getAllByText('Phones/Digital/Computers')[0]).toBeInTheDocument();
    });

    test('renders featured section titles correctly', async () => {
        await act(async () => {
            render(<Homepage />);
        });
        // Update expectations to match the actual section titles in the component
        expect(screen.getByText('Phones/Digital/Computers')).toBeInTheDocument();
        expect(screen.getByText('Fashion/Bags/Sports')).toBeInTheDocument();
        expect(screen.getByText('Baby/Beauty/Personal Care')).toBeInTheDocument();
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
        // Mock useLocation to simulate coming from login page
        require('react-router-dom').useLocation.mockReturnValue({
            state: { fromLogin: true },
            pathname: '/'
        });

        await act(async () => {
            render(<Homepage />);
        });

        // Wait for and verify the snackbar message
        await waitFor(() => {
            expect(screen.getByText('Login Successful!')).toBeInTheDocument();
        });
    });
}); 