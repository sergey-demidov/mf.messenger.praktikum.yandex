module.exports = {
  verbose: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  // coverageDirectory: 'static/coverage',
  testPathIgnorePatterns: [
    '<rootDir>/static/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/lib/icons.ts',
  ],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/lib/icons.ts',
    '<rootDir>/src/lib/mock-utils.ts',
    '<rootDir>/src/lib/__tests__/',
  ],
};
