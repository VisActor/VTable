// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
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
  collectCoverage: false,
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverageFrom: [
    '**/src/**',
    '!**/cjs/**',
    '!**/dist/**',
    '!**/es/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/types/**',
    '!**/interface.ts'
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
    'd3-color': path.resolve(__dirname, './node_modules/d3-color/dist/d3-color.min.js'),
    'd3-array': path.resolve(process.cwd(), './node_modules/d3-array/dist/d3-array.min.js'),
    'd3-geo': path.resolve(__dirname, './node_modules/d3-geo/dist/d3-geo.min.js'),
    'd3-dsv': path.resolve(__dirname, './node_modules/d3-dsv/dist/d3-dsv.min.js'),
    'd3-hexbin': path.resolve(__dirname, './node_modules/d3-hexbin/build/d3-hexbin.min.js'),
    'd3-hierarchy': path.resolve(__dirname, './node_modules/d3-hierarchy/dist/d3-hierarchy.min.js'),
    // '@visactor/vtable-editors': path.resolve(__dirname, '../vtable-editors/src/index.ts'),
    // '@visactor/vtable-plugins': path.resolve(__dirname, '../vtable-plugins/src/index.ts'),
    '@visactor/vtable-editors': '<rootDir>/../vtable-editors/src/index.ts',
    '@visactor/vtable-plugins': '<rootDir>/../vtable-plugins/src/index.ts',
    '@src/vrender': path.resolve(__dirname, './src/vrender.ts'),
    '@visactor/vtable/es/(.*)': '<rootDir>/src/$1',
    '@vutils-extension': path.resolve(__dirname, './src/vutil-extension-temp/index.ts')
  },
  setupFiles: ['./setup-mock.js']
};
