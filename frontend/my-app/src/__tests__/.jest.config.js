module.exports = {
    testPathIgnorePatterns: [
        '/node_modules/',
        'test-utils.js',
        'mocks/'
    ]
};

// Add a dummy test to satisfy Jest
if (typeof describe !== 'undefined') {
    describe('jest.config', () => {
        test('is a configuration file, not a test file', () => {
            expect(true).toBe(true);
        });
    });
} 