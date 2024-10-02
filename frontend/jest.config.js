// /frontend/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['<rootDir>/src/**/*.test.js'], // This will match any .test.js file in the src directory
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
};
