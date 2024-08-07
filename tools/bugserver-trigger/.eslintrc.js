require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@internal/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname },
  globals: {
    __DEV__: 'readonly',
    __VERSION__: 'readonly',
    NodeJS: true
  },
  ignorePatterns: ['scripts']
};
