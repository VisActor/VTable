// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const isCI = process.env.CI === 'true' || process.env.CI === '1';

module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testRegex: '/__tests__(/.*)+\\.test\\.(js|ts)$',
  testPathIgnorePatterns: ['/node_modules/', '/cjs/', '/es/', '/\\.rollup\\.cache/'],
  silent: false,
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        exclude: ['**']
      },
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
        paths: {
          '@src/vrender': ['../vtable/src/vrender.ts'],
          '@src/*': ['../vtable/src/*']
        }
      }
    },
    __DEV__: true
  },
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverageFrom: ['<rootDir>/src/history/**/*.ts'],
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
    'd3-array': path.resolve(
      __dirname,
      '../../common/temp/node_modules/.pnpm/d3-array@3.2.3/node_modules/d3-array/dist/d3-array.min.js'
    ),
    'd3-geo': path.resolve(
      __dirname,
      '../../common/temp/node_modules/.pnpm/d3-geo@1.12.1/node_modules/d3-geo/dist/d3-geo.min.js'
    ),
    'd3-dsv': path.resolve(
      __dirname,
      '../../common/temp/node_modules/.pnpm/d3-dsv@3.0.1/node_modules/d3-dsv/dist/d3-dsv.min.js'
    ),
    'd3-hexbin': path.resolve(
      __dirname,
      '../../common/temp/node_modules/.pnpm/d3-hexbin@0.2.2/node_modules/d3-hexbin/build/d3-hexbin.min.js'
    ),
    'd3-hierarchy': path.resolve(
      __dirname,
      '../../common/temp/node_modules/.pnpm/d3-hierarchy@3.1.2/node_modules/d3-hierarchy/dist/d3-hierarchy.min.js'
    ),
    '^@visactor/vtable/es/(.*)$': '<rootDir>/../vtable/src/$1',
    '@visactor/vtable': path.resolve(__dirname, '../vtable/src/index.ts'),
    '@src/vrender': path.resolve(__dirname, '../vtable/src/vrender.ts')
  },
  setupFiles: ['./setup-mock.js']
};
