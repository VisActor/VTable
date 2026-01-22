/**
 * @type {Partial<import('@internal/bundler').Config>}
 */

module.exports = {
  formats: ['umd'],
  // name: 'VTable',

  umdOutputFilename: 'index',
  minify: false,
  sourcemap: false,
  output: {
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
