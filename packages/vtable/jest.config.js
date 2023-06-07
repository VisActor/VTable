module.exports = {
  runner: 'jest-electron/runner',
  // testRunner: "jest-circus/runner",
  testRegex: '/__tests__/.*\\.test\\.(js|ts|mjs)$',
  testEnvironment: 'jest-electron/environment',
  transform: {
    '^.+\\.(tsx|ts)?$': 'ts-jest',
    '^.+\\.css$': 'jest-transform-stub'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  globals: {
    'ts-jest': {
      isolatedModules: false
    },
    __DEV__: true,
    __VERSION__: '1.0.0' //未生效  目前是在各个test.ts文件中分别定义了global.__VERSION__ = 'none';
  }
};
