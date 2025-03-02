import React from 'react';
import { render, screen, waitFor } from '../../__tests__/test-utils';
import Homepage from '../../page/Homepage';
import { request } from '../../utils/request';

// Mock the request module
jest.mock('../../utils/request', () => require('../mocks/requestMock'));

describe('Homepage', () => {
    beforeEach(() => {
        // Setup mock responses for API calls
        request.post.mockImplementation((url, data) => {
            if (url === '/items/Category' && data.category_name === 'Electronics') {
                return Promise.resolve({
                    items: [
                        { id: 1, Title: 'Electronics Item 1', Price: 100, Pic: '/test1.jpg', Seller_name: 'Seller 1' }
                    ]
                });
            } else if (url === '/items/Category' && data.category_name === 'Phones/Digital/Computers') {
                return Promise.resolve({
                    items: [
                        { id: 2, Title: 'Digital Item 1', Price: 200, Pic: '/test2.jpg', Seller_name: 'Seller 2' }
                    ]
                });
            }
            return Promise.resolve({ items: [] });
        });
    });

    test('renders AppAppBar component', () => {
        render(<Homepage />);
        expect(screen.getByText('GATOR FISH MARKET')).toBeInTheDocument();
    });

    test('renders CategoryMenu component', () => {
        render(<Homepage />);
        expect(screen.getByText('Phones/Digital/Computers')).toBeInTheDocument();
    });

    test('renders featured sections', () => {
        render(<Homepage />);
        expect(screen.getByText('Fashion Refresh')).toBeInTheDocument();
        expect(screen.getByText('Digital Devices')).toBeInTheDocument();
        expect(screen.getByText('Sports Equipment')).toBeInTheDocument();
    });

    test('fetches and displays items from API', async () => {
        render(<Homepage />);

        // Wait for API calls to resolve
        await waitFor(() => {
            expect(request.post).toHaveBeenCalledTimes(2);
        });

        // Check that items are rendered - use getAllByText instead of getByText
        await waitFor(() => {
            expect(screen.getAllByText('Electronics Item 1')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Digital Item 1')[0]).toBeInTheDocument();
        });
    });

    test('shows login success notification when coming from login page', () => {
        // Mock the useLocation hook to return { state: { fromLogin: true } }
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useLocation: () => ({
                state: { fromLogin: true }
            })
        }));

        render(<Homepage />);

        expect(screen.getByText('Login Successful!')).toBeInTheDocument();
    });
}); 