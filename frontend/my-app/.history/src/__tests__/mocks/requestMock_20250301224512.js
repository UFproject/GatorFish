// Mock for src/utils/request.js
const requestMock = {
    post: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
};

export const request = requestMock;

// Add a dummy test to satisfy Jest
describe('requestMock', () => {
    test('is a mock utility, not a test file', () => {
        expect(true).toBe(true);
    });
}); 