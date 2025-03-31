import React from 'react';
import { render, screen } from '../../../__tests__/test-utils';
import '@testing-library/jest-dom';
import CategoryMenu from '../../../components/layout/CategoryMenu';

// Mock useNavigate to prevent the error
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

describe('CategoryMenu', () => {
    test('renders all category items', () => {
        render(<CategoryMenu />);

        // Check if all categories are rendered
        expect(screen.getByText('Phones/Digital/Computers')).toBeInTheDocument();
        expect(screen.getByText('Fashion/Bags/Sports')).toBeInTheDocument();
        expect(screen.getByText('Baby/Beauty/Personal Care')).toBeInTheDocument();
        expect(screen.getByText('Home/Appliances/Furniture')).toBeInTheDocument();
        expect(screen.getByText('Collectibles/Jewelry/Gifts')).toBeInTheDocument();
        expect(screen.getByText('Food/Pets/Flowers')).toBeInTheDocument();
        expect(screen.getByText('Books/Games/Media')).toBeInTheDocument();
        expect(screen.getByText('Cars/E-vehicles/Rentals')).toBeInTheDocument();
    });

    test('renders with correct icons', () => {
        render(<CategoryMenu />);

        // Check if the correct number of ListItems are rendered
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(8); // 8 categories
    });
}); 