module.exports = {
  testEnvironment: 'jsdom', // Simulate a browser environment for React components
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest to transform JS/JSX files
  },
  moduleFileExtensions: ['js', 'jsx'], // Recognize .js and .jsx file extensions
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Path to additional Jest setup (for testing library setup)
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore node_modules and dist for testing
  verbose: true, // Show detailed test results
};
