// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/__tests__(/.*)+\\.test\\.(js|ts)$',
  silent: false,
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        exclude: ['**']
      },
      tsconfig: './tsconfig.test.json'
    },
    __DEV__: true
  },
  collectCoverage: false,
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverageFrom: [
    '**/src/**',
    '!**/cjs/**',
    '!**/dist/**',
    '!**/es/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/types/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  moduleNameMapper: {
    '^@visactor/vtable$': path.resolve(__dirname, '../vtable/src')
  }
};



