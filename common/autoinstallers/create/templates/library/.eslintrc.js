require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@internal/eslint-config/profile/node'],
  parserOptions: { tsconfigRootDir: __dirname },
  // ignorePatterns: [],
};
