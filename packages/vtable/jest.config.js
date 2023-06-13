// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testRegex: '/__tests__/.*\\.test\\.(js|ts)$',
  silent: true,
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
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov'],
  coveragePathIgnorePatterns: ['node_modules', '__tests__', 'interface.ts', '.d.ts', 'typings'],
  setupFiles: ['./setup-mock.js']
};
