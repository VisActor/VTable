const isCI = process.env.CI === 'true' || process.env.CI === '1';

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
  coverageThreshold: isCI
    ? {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    : undefined,
  moduleNameMapper: {},
  setupFiles: ['./setup-mock.js']
};
