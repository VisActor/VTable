module.exports = {
  extends: ['@internal/eslint-config/profile/lib'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    // MCP specific rules
    'no-console': 'off', // MCP tools may need console for logging
  },
};
