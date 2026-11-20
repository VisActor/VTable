/**
 * @type {Partial<import('@internal/bundler').Config>}
 */

module.exports = {
  formats: ['umd'],
  // 聚合器读取各工作区包的 ESM，其中已注入对应包的版本号。
  browserUmd: true,
  tsconfig: 'tsconfig.browser.json',

  umdOutputFilename: 'index',
  minify: false,
  output: {
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
