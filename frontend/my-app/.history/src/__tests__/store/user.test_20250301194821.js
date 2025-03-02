import userReducer, { setToken, clearUserInfo, fetchLogin } from '../../store/modules/user';
import { request } from '../../utils/request';

// Mock the request module
jest.mock('../../utils/request', () => ({
    request: {
        post: jest.fn()
    }
}));

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('User Redux Module', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('should return the initial state', () => {
        const initialState = { token: '' };
        expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    test('should handle setToken action', () => {
        const action = setToken('test-token');
        const state = userReducer(undefined, action);

        expect(state.token).toBe('test-token');
        expect(localStorage.getItem('token_key')).toBe('test-token');
    });

    test('should handle clearUserInfo action', () => {
        // First set a token
        let state = userReducer(undefined, setToken('test-token'));
        expect(state.token).toBe('test-token');

        // Then clear it
        state = userReducer(state, clearUserInfo());
        expect(state.token).toBe('');
        expect(localStorage.getItem('token_key')).toBeNull();
    });

    test('fetchLogin should call API and dispatch setToken', async () => {
        // Setup mock API response
        request.post.mockResolvedValueOnce({ token: 'api-token' });

        // Setup mock dispatch function
        const dispatch = jest.fn();

        // Call the thunk function
        await fetchLogin({ Username: 'test', Password: 'password' })(dispatch);

        // Check API was called correctly
        expect(request.post).toHaveBeenCalledWith('/auth/login', {
            Username: 'test',
            Password: 'password'
        });

        // Check that setToken was dispatched
        expect(dispatch).toHaveBeenCalledWith(setToken('api-token'));
    });
}); 