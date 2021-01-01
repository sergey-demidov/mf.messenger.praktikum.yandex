module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/lib/*.ts',
    // 'src/*.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/static/', '<rootDir>/node_modules/'],
};
