module.exports = {
  runner: 'jest-electron/runner',
  // testRunner: "jest-circus/runner",
  // testRegex: '/__tests__/.*\\.test\\.(js|ts|mjs)$',
  testRegex: '/__tests__/pivotTable.test\\.(js|ts|mjs)$',
  testEnvironment: 'jest-electron/environment',
  transform: {
    '^.+\\.(tsx|ts)?$': 'ts-jest',
    '^.+\\.css$': 'jest-transform-stub'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  globals: {
    'ts-jest': {
      isolatedModules: false
    }
  }
};
