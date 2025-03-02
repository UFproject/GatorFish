import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from '../store/modules/user';
import '@testing-library/jest-dom';
import '../setupMocks';

// Mock BrowserRouter
const MockRouter = ({ children }) => <div>{children}</div>;

// Mock Link component
const MockLink = ({ to, children }) => <a href={to}>{children}</a>;

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    BrowserRouter: ({ children }) => <MockRouter>{children}</MockRouter>,
    Link: ({ to, children }) => <MockLink to={to}>{children}</MockLink>,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: null, pathname: '/' })
}));

function render(
    ui,
    {
        preloadedState,
        store = configureStore({
            reducer: { user: userReducer },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MockRouter>{children}</MockRouter>
            </Provider>
        );
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render }; 