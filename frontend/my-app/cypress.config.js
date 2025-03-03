const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        // Define test credentials here
        TEST_USERNAME: 'testuser',
        TEST_PASSWORD: 'password123',
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
}); 