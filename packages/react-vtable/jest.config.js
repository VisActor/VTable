const path = require('path');
const { createVRenderModuleNameMapper } = require('../../common/config/jest/vrender-module-name-mapper');

module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testRegex: '/__tests__(/.*)+\\.test\\.(js|ts|tsx)$',
  silent: false,
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
        jsx: 'react',
        baseUrl: '.',
        paths: {
          '@visactor/vtable': ['../vtable/src/index'],
          '@visactor/vtable/*': ['../vtable/src/*'],
          '@src/*': ['../vtable/src/*'],
          '@vutils-extension': ['../vtable/src/vutil-extension-temp/index']
        }
      }
    },
    __DEV__: true
  },
  cacheDirectory: '<rootDir>/.jest-cache',
  moduleNameMapper: {
    'd3-color': path.resolve(__dirname, '../vtable/node_modules/d3-color/dist/d3-color.min.js'),
    'd3-array': path.resolve(__dirname, '../vtable/node_modules/d3-array/dist/d3-array.min.js'),
    'd3-geo': path.resolve(__dirname, '../vtable/node_modules/d3-geo/dist/d3-geo.min.js'),
    'd3-dsv': path.resolve(__dirname, '../vtable/node_modules/d3-dsv/dist/d3-dsv.min.js'),
    'd3-hexbin': path.resolve(__dirname, '../vtable/node_modules/d3-hexbin/build/d3-hexbin.min.js'),
    'd3-hierarchy': path.resolve(__dirname, '../vtable/node_modules/d3-hierarchy/dist/d3-hierarchy.min.js'),
    ...createVRenderModuleNameMapper('<rootDir>/../vtable/node_modules'),
    '@visactor/vtable$': '<rootDir>/../vtable/src/index',
    '@visactor/vtable/es/(.*)': '<rootDir>/../vtable/src/$1',
    '@src/(.*)': '<rootDir>/../vtable/src/$1',
    '@vutils-extension': '<rootDir>/../vtable/src/vutil-extension-temp/index'
  },
  setupFiles: ['./setup-mock.js']
};
