const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '/__tests__(/.*)+\\.test\\.(js|ts)$',
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
  moduleNameMapper: {
    '@visactor/vtable$': '<rootDir>/../vtable/src/index',
    '@visactor/vtable/es/(.*)': '<rootDir>/../vtable/src/$1'
  },
  setupFiles: ['./setup-mock.js']
};
