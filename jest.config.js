module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/lib/*.ts',
    // 'src/*.ts',
  ],
  coverageDirectory: 'static/coverage',
  testPathIgnorePatterns: [
    '<rootDir>/static/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/lib/icons.ts'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/lib/icons.ts',
    '<rootDir>/src/lib/mock-utils.ts',
  ],
};
