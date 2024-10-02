// /backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'], // This will match any .test.js file in the tests directory
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
