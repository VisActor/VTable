module.exports = {
  extends: ['@internal/eslint-config/profile/lib'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  env: {
    es2021: true,
    node: true,
  },
  rules: {
    // CLI 工具允许使用 console 输出
    'no-console': 'off',
  },
};


