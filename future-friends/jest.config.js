module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'], // This matches any .test.js file in the __tests__ folder
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
