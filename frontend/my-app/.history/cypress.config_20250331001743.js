const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        // Define test credentials (updated with correct credentials)
        TEST_USERNAME: 'test',
        TEST_PASSWORD: '114514',
        SELLER_USERNAME: 'selleruser',
        SELLER_PASSWORD: 'password123',
        // API Mocking flags
        MOCK_API: true,
        API_DELAY: 300 // ms delay for mocked responses
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    // Increase default timeout for tests
    defaultCommandTimeout: 10000,
    // Disable waiting for API requests that may never occur
    waitForAnimations: false,
    // Add retry ability
    retries: {
        runMode: 1,
        openMode: 0
    },
}); 