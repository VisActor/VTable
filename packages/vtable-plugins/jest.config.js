module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|js)'],
  silent: false,
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        exclude: ['**']
      },
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true
      }
    },
    __DEV__: true
  },
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverageFrom: [
    '<rootDir>/src/history/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {},
  setupFiles: ['./setup-mock.js']
};
