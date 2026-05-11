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
      tsconfig: './tsconfig.test.json'
    },
    __DEV__: true
  },
  moduleNameMapper: {
    '@visactor/vtable$': '<rootDir>/../vtable/src/index',
    '@visactor/vtable/es/(.*)': '<rootDir>/../vtable/src/$1',
    '^@visactor/vtable/src/(.*)$': '<rootDir>/../vtable/src/$1',
    '^@visactor/vtable/src/ts-types$': '<rootDir>/../vtable/src/ts-types/index.ts',
    '^@visactor/vtable/src/vrender$': '<rootDir>/../vtable/src/vrender.ts',
    '^@src/vrender$': path.resolve(__dirname, '../vtable/src/vrender.ts')
  },
  setupFiles: ['./setup-mock.js']
};
