const path = require('path');
const isCI = process.env.CI === 'true' || process.env.CI === '1';
const { createVRenderModuleNameMapper } = require('../../common/config/jest/vrender-module-name-mapper');

module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
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
          branches: 65,
          functions: 80,
          lines: 78,
          statements: 78
        }
      }
    : undefined,
  moduleNameMapper: {
    'd3-color': path.resolve(__dirname, '../vtable/node_modules/d3-color/dist/d3-color.min.js'),
    'd3-array': path.resolve(__dirname, '../vtable/node_modules/d3-array/dist/d3-array.min.js'),
    'd3-geo': path.resolve(__dirname, '../vtable/node_modules/d3-geo/dist/d3-geo.min.js'),
    'd3-dsv': path.resolve(__dirname, '../vtable/node_modules/d3-dsv/dist/d3-dsv.min.js'),
    'd3-hexbin': path.resolve(__dirname, '../vtable/node_modules/d3-hexbin/build/d3-hexbin.min.js'),
    'd3-hierarchy': path.resolve(__dirname, '../vtable/node_modules/d3-hierarchy/dist/d3-hierarchy.min.js'),
    ...createVRenderModuleNameMapper('<rootDir>/../vtable/node_modules'),
    '^@visactor/vtable-editors$': path.resolve(__dirname, '../vtable-editors/src/index.ts'),
    '^@visactor/vtable/es/ts-types$': '<rootDir>/../vtable/cjs/ts-types/index.js',
    '^@visactor/vtable/es/(.*)$': '<rootDir>/../vtable/cjs/$1.js',
    '^@visactor/vtable$': path.resolve(__dirname, '../vtable/cjs/index.js'),
    '^@src/vrender$': path.resolve(__dirname, '../vtable/src/vrender.ts')
  },
  setupFiles: ['./setup-mock.js']
};
